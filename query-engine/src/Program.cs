namespace QueryEngine
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;
    using System.Reflection;
    using System.Runtime.Loader;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Configuration;
    using Microsoft.DotNet.ProjectModel.Workspaces;
    using Microsoft.CodeAnalysis;
    using Microsoft.CodeAnalysis.CSharp;
    using Microsoft.CodeAnalysis.Emit;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Scaffolding.Internal;
    using Microsoft.EntityFrameworkCore.Design;
    using Microsoft.EntityFrameworkCore.Design.Internal;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Hosting;
    using QueryEngine.Model;

    public class Program
    {
        public static void Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .AddCommandLine(new[] { "--server.urls", "http://localhost:8111" });
            var builder = new WebHostBuilder()
                .UseConfiguration(config.Build())
                .UseStartup(typeof(Startup))
                .UseServer("Microsoft.AspNetCore.Server.Kestrel");

            using (var app = builder.Build())
            {
                app.Start();
                var appLifeTime = (IApplicationLifetime) app.Services.GetService(typeof(IApplicationLifetime));
                appLifeTime.ApplicationStopping.WaitHandle.WaitOne();
            }
        }
    }
}
