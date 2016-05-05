namespace QueryEngine 
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using QueryEngine.Services;
    using QueryEngine.Handlers;

    public class Startup
    {
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(LogLevel.Debug);
            app.UseMiddleware<StatusHandler>();
            app.UseMiddleware<QueryHandler>();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var schemaService = new SchemaService();
            var compiler = new CompileService(schemaService);
            var queryService = new QueryService(compiler);
            services.AddSingleton<QueryService>(queryService);
        }
    }
}
