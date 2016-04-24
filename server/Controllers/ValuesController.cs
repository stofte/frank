using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using System.Reflection;
using System.IO;
using System.Runtime.Loader;
using Microsoft.CodeAnalysis.Emit;
using System.Threading;
using Microsoft.Extensions.Logging;
using Microsoft.Data.Entity.Design;
using Microsoft.Data.Entity.Scaffolding.Internal;
using Microsoft.Data.Entity.Design.Internal;
using Microsoft.Extensions.PlatformAbstractions;

namespace server.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            var libFixes = new string[] {
                Path.Combine(PlatformServices.Default.LibraryManager.GetLibraries()
                    .Where(lib => lib.Name.Contains("System.Linq.Expressions") && lib.Version == "4.0.11-beta-23516")
                    .Last().Path, "ref", "netcore50", "System.Linq.Expressions.dll"),
                Path.Combine(PlatformServices.Default.LibraryManager.GetLibraries()
                    .Where(lib => lib.Name == "System.Reflection")
                    .First().Path, "lib", "netcore50", "System.Reflection.dll"),
            };

            var x = PlatformServices.Default.LibraryManager.GetLibraries()
                    .Where(lib => lib.Name.Contains("System.Reflection")).ToArray();

            var assmTypes = new Type[]
            {
                typeof(Object), // mscorlib
                typeof(ISet<>), // System.Runtime
                typeof(Enumerable), // System.Linq
                typeof(System.Data.Common.DbConnection), // System.Data.Common
                typeof(System.ComponentModel.DataAnnotations.CustomValidationAttribute), // System.ComponentModel.DataAnnotations
                typeof(PropertyInfo), // System.Reflection
                typeof(Microsoft.Data.Entity.DbContext), // EntityFramework.Core
                typeof(Microsoft.Data.Entity.SqlServerDbContextOptionsExtensions), // EntityFramework.MicrosoftSqlServer
                typeof(Microsoft.Data.Entity.RelationalDatabaseFacadeExtensions), // EntityFramework.Relational
            }.Select(type => type.GetTypeInfo().Assembly.Location);
            
            var assemblyName = Guid.NewGuid().ToIdentifierWithPrefix("a");
            var references = assmTypes.Concat(libFixes).Select(path => MetadataReference.CreateFromFile(path));
            
            var dbFiles = DbFiles();
            var compilerOptions = new CSharpCompilationOptions(outputKind: OutputKind.DynamicallyLinkedLibrary);

            var trees = new SyntaxTree[] {
                CSharpSyntaxTree.ParseText(_querySource),
            }.Concat(dbFiles.Select(s => CSharpSyntaxTree.ParseText(s)));

            var compilation = CSharpCompilation.Create(assemblyName)
                .WithOptions(compilerOptions)
                .WithReferences(references)
                .AddSyntaxTrees(trees);
            var stream = new MemoryStream();
            
            var compilationResult = compilation.Emit(stream, options: new EmitOptions());
            stream.Position = 0;
            LibraryLoader.Instance.Value.AssemblyStream = stream;
            var asm = LibraryLoader.Instance.Value.LoadFromAssemblyName(new AssemblyName(assemblyName));
            try
            {
                var programType = asm.GetTypes().First();
                var instance = Activator.CreateInstance(programType);
                var method = programType.GetMethod("Run");
                var result = method.Invoke(instance, new object[] { }) as string;
                return new string[] { result };
            }
            catch (ReflectionTypeLoadException exn)
            {
                var prop = exn.LoaderExceptions;
                return new string[] { "failed" };
            }
        }
        
        private IEnumerable<string> DbFiles()
        {
            var loggerFactory = new LoggerFactory().AddConsole();
            var loggerProvider = new LoggerProvider((string str) => new Logger<string>(loggerFactory));

            var assemblyName = "Microsoft.Data.MicrosoftSqlServer";
            var connStr = @"Data Source=.\sqlexpress;Integrated Security=True;Initial Catalog=eftest";

            var x = new DatabaseOperations(
                loggerProvider: loggerProvider,
                assemblyName: assemblyName,
                startupAssemblyName: "EntityFramework.MicrosoftSqlServer",
                environment: "X",
                projectDir: @"C:\ef_temp",
                rootNamespace: "Foo"
            );

            var gentask = x.ReverseEngineerAsync(
                provider: "EntityFramework.MicrosoftSqlServer",
                connectionString: connStr,
                outputDir: @"C:\ef_temp2",
                dbContextClassName: "Program",
                schemas: null,
                tables: null,
                useDataAnnotations: true,
                cancellationToken: default(CancellationToken));

            gentask.Wait();
            var list = new List<string>();
            ReverseEngineerFiles files = gentask.Result;
            list.Add(System.IO.File.ReadAllText(files.ContextFile));
            foreach (var f in files.EntityTypeFiles)
            {
                list.Add(System.IO.File.ReadAllText(f));
            }
            return list;
        }
        
        string _querySource = @"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Foo
{
    public partial class Program
    {
        public string Run()
        {
            return eftable.First().MyValue; // ""hello!""
        }
    }
}
";
    }
}
