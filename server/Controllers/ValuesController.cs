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

namespace server.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            var fileName = @"C:\test.dll";
            var assemblyName = "test";
            if (System.IO.File.Exists(fileName))
            {
                System.IO.File.Delete(fileName);
            }
            
            var references = new MetadataReference[]
            {
                MetadataReference.CreateFromFile(typeof(ISet<>).GetTypeInfo().Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Enumerable).GetTypeInfo().Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Object).GetTypeInfo().Assembly.Location),
            };

            var compilerOptions = new CSharpCompilationOptions(outputKind: OutputKind.DynamicallyLinkedLibrary);
            var tree = CSharpSyntaxTree.ParseText(_source);
            var compilation = CSharpCompilation.Create(assemblyName)
                .WithOptions(compilerOptions)
                .WithReferences(references)
                .AddSyntaxTrees(new SyntaxTree[] { tree });
            var stream = new MemoryStream();
            using (var fs = new FileStream(fileName, FileMode.Create))
            {
                var compilationResult = compilation.Emit(fs, options: new EmitOptions());
            }
            LibraryLoader.Instance.Value.AssemblyPath = fileName;
            var asm = LibraryLoader.Instance.Value.LoadFromAssemblyName(new AssemblyName(assemblyName));
            var programType = asm.GetTypes().First();
            var instance = Activator.CreateInstance(programType);
            var method = programType.GetMethod("Run");
            var result = method.Invoke(instance, new object[] { }) as string;
           
            return new string[] { result };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
        
        string _source = @"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    public class Program
    {
        public string Run()
        {
            return ""Hello world"";
        }
    }
}
";
    }
}
