namespace QueryEngine.Services
{
    using System;
    using System.Collections.Generic;
    using System.Reflection;
    using QueryEngine.Models;

    public class QueryService
    {
        CompileService _compiler;
        DatabaseContextService _databaseContextService;

        public QueryService(CompileService compiler, DatabaseContextService databaseContextService)
        {
            _compiler = compiler;
            _databaseContextService = databaseContextService;
        }

        public IDictionary<string, object> ExecuteQuery(QueryInput input)
        {
            var contextResult = _databaseContextService.GetDatabaseContext(input.ConnectionString);
            var assmName = Guid.NewGuid().ToIdentifierWithPrefix("a");
            var programSource = _template
                .Replace("##SOURCE##", input.Text)
                .Replace("##NS##", assmName)
                .Replace("##DB##", contextResult.Type.ToString());

            var result = _compiler.LoadType(programSource, assmName, contextResult.Reference);
            var method = result.Type.GetMethod("Run");
            var programInstance = Activator.CreateInstance(result.Type);
            var res = method.Invoke(programInstance, new object[] { }) as IDictionary<string, object>;
            return res;
        }

        string _template = @"
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ##NS##
{
    public partial class Program : ##DB##
    {
        public IDictionary<string, object> Run()
        {
            using (var ctx = new Program()) 
            {
                // todo need something better
                Dumper._results = new Dictionary<string, object>();
                Dumper._count = 0;
                ctx.Query();
                return Dumper._results;
            }
        }

        void Query()
        {
##SOURCE##
        }
    }

    public static class Dumper 
    {
        public static IDictionary<string, object> _results;
        public static int _count;

        public static T Dump<T>(this T o)
        {
            // since the context is lost when returning, we tolist anything we dump
            var name = o.GetType().Name;
            object result = null;
            
            if (o is IEnumerable<object>)
            {
                name = o.GetType().GetTypeInfo().GenericTypeArguments[0].Name;
                var ol = o as IEnumerable<object>;
                result = ol.ToList();
            }
            else
            {
                result = o;
            }
            var displayName = string.Format(""{0} {1}"", PrettyAnonymous(name), ++_count);
            _results.Add(displayName, result);
            return o;
        }

        static string PrettyAnonymous(string name) 
        {
            return name.Contains(""AnonymousType"") ? ""AnonymousType"" : name;
        }
    }
}
";
    }
}
