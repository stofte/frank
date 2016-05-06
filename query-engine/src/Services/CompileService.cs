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
    using Microsoft.CodeAnalysis.Emit;
    using Microsoft.CodeAnalysis.CSharp;
    using Microsoft.CodeAnalysis.CSharp.Syntax;

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
            var replacements = new Dictionary<SyntaxNode, SyntaxNode>();
            var programSource = _template.Replace("##SOURCE##", querySource).Replace("##NS##", assemblyName) 
                + "\n" + schemaSource;
            var tree = CSharpSyntaxTree.ParseText(programSource);
            var nodes = tree.GetRoot().DescendantNodes().OfType<NamespaceDeclarationSyntax>().Skip(2)
                .SelectMany(ns => ns.DescendantNodes())
                .OfType<ClassDeclarationSyntax>();

            foreach (var node in nodes)
            {
                var newNode = node
                    .WithAttributeLists(
                        SyntaxFactory.SingletonList<AttributeListSyntax>(
                            SyntaxFactory.AttributeList(
                                SyntaxFactory.SingletonSeparatedList<AttributeSyntax>(
                                    SyntaxFactory.Attribute(
                                        SyntaxFactory.IdentifierName("Foo"))))));
                replacements.Add(node, newNode);
            }

            var newTree = tree.GetRoot().ReplaceNodes(replacements.Keys, (n1, n2) => replacements[n1]);
            return newTree.NormalizeWhitespace().ToString();
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
                foreach(var r in compilationResult.Diagnostics.Where(x => x.Severity == DiagnosticSeverity.Error)) 
                {
                    Console.WriteLine("Error: {0}", r);
                }
            }

            LibraryLoader.Instance.Value.AssemblyStream = stream;
            var asm = LibraryLoader.Instance.Value.LoadFromAssemblyName(new AssemblyName(assemblyName));
            var programType = asm.GetTypes().Single(t => t.Name == "Program");
            return programType;
        }
        
        string _template = @"
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
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
        public IDictionary<string, object> Run()
        {
            using (var ctx = new Program()) 
            {
                // todo need something better
                Dumper._results = new Dictionary<string, object>();
                Dumper._count = 0;
                ctx.Query();
                return Dumper._results;
            }
        }

        void Query()
        {
##SOURCE##
        }
    }

    public static class Dumper 
    {
        public static IDictionary<string, object> _results;
        public static int _count;

        public static T Dump<T>(this T o)
        {
            // since the context is lost when returning, we tolist anything we dump
            var name = o.GetType().Name;
            object result = null;
            
            if (o is IEnumerable<object>)
            {
                name = o.GetType().GetTypeInfo().GenericTypeArguments[0].Name;
                var ol = o as IEnumerable<object>;
                result = ol.ToList();
            }
            else
            {
                result = o;
            }
            var displayName = string.Format(""{0} {1}"", PrettyAnonymous(name), ++_count);
            _results.Add(displayName, result);
            return o;
        }

        static string PrettyAnonymous(string name) 
        {
            return name.Contains(""AnonymousType"") ? ""AnonymousType"" : name;
        }
    }
}
";
    }
}
