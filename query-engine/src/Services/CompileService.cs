namespace QueryEngine.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;
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

    public class CompileService
    {
        SchemaService _schemaService;
        string _projectjsonPath;

        public CompileService(SchemaService schemaService) 
        {
            _schemaService = schemaService;
            _projectjsonPath = Directory.GetCurrentDirectory();
            AssemblyLoadContext.InitializeDefaultContext(LibraryLoader.Instance.Value);
        }

        public string TransformSource(string querySource, string schemaSource, string assemblyName) 
        {
            var programSource = _template.Replace("##SOURCE##", querySource).Replace("##NS##", assemblyName) 
                + "\n" + schemaSource;
            var tree = CSharpSyntaxTree.ParseText(programSource);
            return tree.ToString();
        }

        public Type LoadProgram(string source, string connectionString) 
        {
            var assemblyName = Guid.NewGuid().ToIdentifierWithPrefix("a");
            var prj = new ProjectJsonWorkspace(_projectjsonPath)
                .CurrentSolution.Projects.First();

            var compilerOptions = new CSharpCompilationOptions(outputKind: OutputKind.DynamicallyLinkedLibrary);
            var programSource = _template.Replace("##SOURCE##", source).Replace("##NS##", assemblyName) 
                + "\n" + _schemaService.GetSchemaSource(connectionString, assemblyName);

            var trees = new SyntaxTree[] {
                CSharpSyntaxTree.ParseText(programSource),
            };

            var compilation = CSharpCompilation.Create(assemblyName)
                .WithOptions(compilerOptions)
                .WithReferences(prj.MetadataReferences)
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

            LibraryLoader.Instance.Value.AssemblyStream = stream;
            var asm = LibraryLoader.Instance.Value.LoadFromAssemblyName(new AssemblyName(assemblyName));
            var programType = asm.GetTypes().Single(t => t.Name == "Program");
            return programType;
        }
        
        string _template = @"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ##NS##
{
    public partial class Program
    {
        public static string Main()
        {
            using (var ctx = new Program()) 
            {
                return ctx.Execute();
            }
        }

        string Execute() 
        {
            return ##SOURCE##;
        }
    }
}
";
    }
}
