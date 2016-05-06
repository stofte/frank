namespace QueryEngine.Handlers
{
    using System;
    using System.Reflection;
    using System.Collections;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Runtime.Serialization.Json;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    using QueryEngine.Services;
    using QueryEngine.Models;
    using Newtonsoft.Json;

    public class DebugHandler : BaseHandler<string, QueryInput>
    {
        SchemaService _schemaService;
        CompileService _compileService;

        public DebugHandler(RequestDelegate next, SchemaService service, CompileService compileService) : base(next) 
        {
            _schemaService = service;
            _compileService = compileService;
        }

        protected override bool Handle(string path)
        {
            return path.Contains("/debug");
        }

        protected override string Execute(QueryInput input)
        {
            var schema = _schemaService.GetSchemaSource(input.ConnectionString, "debug");
            var transformed = _compileService.TransformSource(input.Text, schema, "debug");
            var x = new List<DebugHandler>();
            return JsonConvert.SerializeObject(x.GetType().GetTypeInfo().GenericTypeArguments[0]); //schema + "\n\n=>\n\n" + transformed;
        }
    }
}