namespace QueryEngine.Handlers
{
    using System;
    using System.Threading.Tasks;
    using System.Runtime.Serialization.Json;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    using QueryEngine.Services;

    public class StatusHandler : BaseHandler<bool, string>
    {
        public StatusHandler(RequestDelegate next) : base(next) { }

        protected override bool Handle(string path)
        {
            return path.Contains("/status");
        }

        protected override bool Execute(string input)
        {
            return true;
        }
    }
}