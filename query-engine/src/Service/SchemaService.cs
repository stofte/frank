namespace QueryEngine.Service
{
    using System;
    using System.Text;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.Extensions.Logging;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Scaffolding.Internal;
    using Microsoft.EntityFrameworkCore.Design;
    using Microsoft.EntityFrameworkCore.Design.Internal;
    
    public class SchemaService 
    {
        public string GetSchemaSource(string connectionString, string assemblyNamespace) 
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
                ConnectionString = connectionString,
                ContextClassName = "Program",
                ProjectPath = "na",
                ProjectRootNamespace = assemblyNamespace,
                OutputPath = outputPath
            };

            var output = new StringBuilder();
            var resFiles = rGen.GenerateAsync(conf);
            resFiles.Wait();
            output.Append(StripHeaderLines(2, fs.RetrieveFileContents(outputPath, programName + ".cs")));
            foreach(var fpath in resFiles.Result.EntityTypeFiles)
            {
                output.Append(StripHeaderLines(4, fs.RetrieveFileContents(outputPath, System.IO.Path.GetFileName(fpath))));
            }

            return output.ToString();
        }

        string StripHeaderLines(int lines, string contents) 
        {
            return string.Join("\n", contents.Split('\n').Skip(lines));
        }
    }
}
