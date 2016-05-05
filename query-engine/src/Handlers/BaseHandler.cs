namespace QueryEngine.Handlers
{
    using System;
    using System.Diagnostics;
    using System.Threading.Tasks;
    using System.Runtime.Serialization.Json;
    using Microsoft.AspNetCore.Http;

    public abstract class BaseHandler<TResult, TInput>
    {
        protected RequestDelegate _next;

        public BaseHandler(RequestDelegate next) 
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var sw = new Stopwatch();
            sw.Start();
            if (context.Request.Path.HasValue && Handle(context.Request.Path.Value))
            {
                TInput input = default(TInput);
                if (context.Request.Method == "POST") 
                {
                    var inputSerializer = new DataContractJsonSerializer(typeof(TInput));
                    input = (TInput) inputSerializer.ReadObject(context.Request.Body);
                }
                var res = Execute(input);
                var js = new DataContractJsonSerializer(typeof(TResult));
                context.Response.Headers.Add("Content-Type", new [] { "application/json; charset=utf-8" });
                context.Response.Headers.Add("X-Duration-Milliseconds", Math.Ceiling(sw.Elapsed.TotalMilliseconds).ToString());
                js.WriteObject(context.Response.Body, res);
                return;
            }
            await _next(context);
        }

        protected abstract bool Handle(string path);

        protected abstract TResult Execute(TInput input);
    }
}
