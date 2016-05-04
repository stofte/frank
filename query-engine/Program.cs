namespace QueryEngine
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.IO;
    using System.Reflection;
    using System.Runtime.Loader;
    using Microsoft.Extensions.Logging;
    using Microsoft.DotNet.ProjectModel.Workspaces;
    using Microsoft.CodeAnalysis;
    using Microsoft.CodeAnalysis.CSharp;
    using Microsoft.CodeAnalysis.Emit;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Scaffolding.Internal;
    using Microsoft.EntityFrameworkCore.Design;
    using Microsoft.EntityFrameworkCore.Design.Internal;
    using Newtonsoft.Json;

    public class Program
    {
        public static void Main(string[] args)
        {
            AssemblyLoadContext.InitializeDefaultContext(LibraryLoader.Instance.Value);

            var assemblyName = "test";
            var sln = new ProjectJsonWorkspace(Directory.GetCurrentDirectory())
                .CurrentSolution.Projects.First();
            // Console.WriteLine("Reference count: {0}", sln.MetadataReferences.Count());

            var compilerOptions = new CSharpCompilationOptions(outputKind: OutputKind.DynamicallyLinkedLibrary);
            var programSource = _source + "\n" + string.Join("\n", DbFiles());
            var trees = new SyntaxTree[] {
                CSharpSyntaxTree.ParseText(programSource),
            };

            var compilation = CSharpCompilation.Create(assemblyName)
                .WithOptions(compilerOptions)
                .WithReferences(sln.MetadataReferences)
                .AddSyntaxTrees(trees);

            var stream = new MemoryStream();
            var compilationResult = compilation.Emit(stream, options: new EmitOptions());
            stream.Position = 0;
            if (!compilationResult.Success) 
            {
                foreach(var r in compilationResult.Diagnostics) 
                {
                    Console.WriteLine("Diagnostics: {0}", r);
                }
            }

            // var str = JsonConvert.SerializeObject(compilationResult);
            // Console.WriteLine(str);

            LibraryLoader.Instance.Value.AssemblyStream = stream;
            var asm = LibraryLoader.Instance.Value.LoadFromAssemblyName(new AssemblyName(assemblyName));
            var programType = asm.GetTypes().Single(t => t.Name == "Program");
            var method = programType.GetMethod("Main");
            var programInstance = Activator.CreateInstance(programType);
            var res = method.Invoke(programInstance, new object[] { }) as string;
            Console.WriteLine("query: {0}", res);
        }

        private static IEnumerable<string> DbFiles() 
        {
            var loggerFactory = new LoggerFactory().AddConsole();

            var ssTypeMap = new Microsoft.EntityFrameworkCore.Storage.Internal.SqlServerTypeMapper();
            var ssDbFac = new SqlServerDatabaseModelFactory(loggerFactory: loggerFactory);
            var ssScaffoldFac = new SqlServerScaffoldingModelFactory(
                loggerFactory: loggerFactory,
                typeMapper: ssTypeMap,
                databaseModelFactory: ssDbFac
            );

            var ssAnnotationProvider = new Microsoft.EntityFrameworkCore.Metadata.SqlServerAnnotationProvider();
            var csUtils = new CSharpUtilities();
            var scaffUtils = new ScaffoldingUtilities();

            var confFac = new ConfigurationFactory(
                extensionsProvider: ssAnnotationProvider,
                cSharpUtilities: csUtils,
                scaffoldingUtilities: scaffUtils
            );
            var fs = new InMemoryFileService();
            var sb = new StringBuilderCodeWriter(
                fileService: fs,
                dbContextWriter: new DbContextWriter(
                    scaffoldingUtilities: scaffUtils,
                    cSharpUtilities: csUtils
                ),
                entityTypeWriter: new EntityTypeWriter(cSharpUtilities: csUtils)
            );

            var rGen = new ReverseEngineeringGenerator(
                loggerFactory: loggerFactory,
                scaffoldingModelFactory: ssScaffoldFac,
                configurationFactory: confFac,
                codeWriter: sb
            );

            var outputPath = @"C:\temp";
            var programName = "Program";
            var conf = new ReverseEngineeringConfiguration 
            {
                ConnectionString = @"Data Source=.\sqlexpress;Integrated Security=True;Initial Catalog=eftest",
                ContextClassName = "Program",
                ProjectPath = "na",
                ProjectRootNamespace = "Foo",
                OutputPath = outputPath
            };

            var files = new List<string>();
            var resFiles = rGen.GenerateAsync(conf);
            resFiles.Wait();
            files.Add(StripHeaderLines(2, fs.RetrieveFileContents(outputPath, programName + ".cs")));
            foreach(var fpath in resFiles.Result.EntityTypeFiles)
            {
                files.Add(StripHeaderLines(4, fs.RetrieveFileContents(outputPath, System.IO.Path.GetFileName(fpath))));
            }
            return files;
        }

        static string StripHeaderLines(int lines, string contents) 
        {
            return string.Join("\n", contents.Split('\n').Skip(lines));
        }

        static string _source = @"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Foo
{
    public partial class Program
    {
        public static string Main()
        {
            using (var ctx = new Program()) 
            {
                return ctx.eftable.First().MyValue;
            }
            //Console.WriteLine(""Hello world"");
        }
    }
}
";
    }
}
