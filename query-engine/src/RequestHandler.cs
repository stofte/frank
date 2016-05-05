namespace QueryEngine
{
    using System;
    using System.Threading.Tasks;
    using System.Runtime.Serialization.Json;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    using QueryEngine.Services;

    public class RequestHandler
    {
        RequestDelegate _next;
        QueryService _service;

        public RequestHandler(RequestDelegate next, QueryService service) 
        {
            _next = next;
            _service = service;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.Request.Path.HasValue)
            {
                var res = _service.ExecuteQuery(new Models.QueryInput
                {
                    ConnectionString = @"Data Source=.\sqlexpress;Integrated Security=True;Initial Catalog=eftest",
                    Source = "eftable.First().MyValue",
                });
                var js = new DataContractJsonSerializer(typeof(Models.QueryResult));
                context.Response.Headers.Add("content-type", new [] { "application/json; charset=utf-8" });
                js.WriteObject(context.Response.Body, new Models.QueryResult { Value = res });
                return;
            }
            await _next(context);
        }
    }
}
