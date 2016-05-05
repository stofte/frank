namespace QueryEngine.Handlers
{
    using System;
    using System.Threading.Tasks;
    using System.Runtime.Serialization.Json;
    using Microsoft.AspNetCore.Http;

    public abstract class BaseHandler<T>
    {
        protected RequestDelegate _next;

        public BaseHandler(RequestDelegate next) 
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.Request.Path.HasValue && Handle(context.Request.Path.Value))
            {
                T res = Execute();
                var js = new DataContractJsonSerializer(typeof(T));
                context.Response.Headers.Add("content-type", new [] { "application/json; charset=utf-8" });
                js.WriteObject(context.Response.Body, res);
                return;
            }
            await _next(context);
        }

        protected abstract bool Handle(string path);

        protected abstract T Execute();
    }
}
