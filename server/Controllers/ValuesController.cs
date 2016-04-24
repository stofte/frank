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

namespace server.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            var s = LanguageVersion.CSharp1.ToString();
            
            var compilerOptions = new CSharpCompilationOptions(outputKind: OutputKind.DynamicallyLinkedLibrary);
            //var tree = CSharpSyntaxTree.ParseText(_source);
            //var compilation = CSharpCompilation.Create("test")
            //    .WithOptions(compilerOptions)
            //    .AddSyntaxTrees(new SyntaxTree[] { tree });
            //var stream = new MemoryStream();
            var an = new AssemblyName();
            
            return new string[] { s, Accessibility.Friend.ToString() };
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
        public string Run(string[] args)
        {

            return ""hello""
        }
    }
}
";
    }

    public class MyAssemblyLoadContext : AssemblyLoadContext
    {
        protected override Assembly Load(AssemblyName assemblyName)
        {
            
            return null; // base.LoadFromAssemblyPath("C:\\Github\\DefALC\\1\\" + assemblyName.Name + ".dll");
        }
    }
}
