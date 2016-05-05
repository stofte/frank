namespace QueryEngine.Handlers
{
    using System;
    using System.Threading.Tasks;
    using System.Runtime.Serialization.Json;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    using QueryEngine.Services;
    using QueryEngine.Models;

    public class DebugHandler : BaseHandler<string, QueryInput>
    {
        SchemaService _service;

        public DebugHandler(RequestDelegate next, SchemaService service) : base(next) 
        {
            _service = service;
        }

        protected override bool Handle(string path)
        {
            return path.Contains("/debug");
        }

        protected override string Execute(QueryInput input)
        {
            return _service.GetSchemaSource(input.ConnectionString, input.Text);
        }
    }
}