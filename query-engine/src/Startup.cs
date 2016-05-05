namespace QueryEngine 
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;

    public class Startup
    {
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();
            app
                .UseMiddleware<RequestHandler>();
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
