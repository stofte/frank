using Microsoft.Data.Entity.Design;
using Microsoft.Data.Entity.Design.Internal;
using Microsoft.Data.Entity.Scaffolding;
using Microsoft.Data.Entity.Scaffolding.Internal;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var loggerFactory = new LoggerFactory().AddConsole();
            var loggerProvider = new LoggerProvider((string str) => new Logger<string>(loggerFactory));
            
            var assemblyName = "Microsoft.Data.MicrosoftSqlServer";
            var connStr = @"Data Source=.\sqlexpress;Integrated Security=True;Initial Catalog=Opera18500DB";

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
                dbContextClassName: "DbContext",
                schemas: null,
                tables: null,
                useDataAnnotations: true,
                cancellationToken: default(CancellationToken));

            gentask.Wait();
            ReverseEngineerFiles files = gentask.Result;
            Console.WriteLine("ContextFile: {0}", files.ContextFile);
            foreach(var f in files.EntityTypeFiles)
            {
                Console.WriteLine("EntityTypeFile: {0}", f);
            }
        }
    }
}
