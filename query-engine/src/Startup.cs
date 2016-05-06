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
            app.UseMiddleware<DebugHandler>();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var schemaService = new SchemaService();
            var compiler = new CompileService(schemaService);
            var dbContextService = new DatabaseContextService(schemaService, compiler);
            var queryService = new QueryService(compiler, dbContextService);
            services.AddSingleton<QueryService>(queryService);
            services.AddSingleton<SchemaService>(schemaService);
            services.AddSingleton<CompileService>(compiler);
            services.AddSingleton<DatabaseContextService>(dbContextService);
        }
    }
}
