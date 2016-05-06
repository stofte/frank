namespace QueryEngine.Services
{
    using System;
    using System.Collections.Generic;
    using System.Reflection;
    using QueryEngine.Models;

    public class QueryService
    {
        CompileService _compiler;

        public QueryService(CompileService compiler)
        {
            _compiler = compiler;
        }

        public IDictionary<string, object> ExecuteQuery(QueryInput input)
        {
            var programType = _compiler.LoadProgram(input.Text, input.ConnectionString);
            var method = programType.GetMethod("Run");
            var programInstance = Activator.CreateInstance(programType);
            var res = method.Invoke(programInstance, new object[] { }) as IDictionary<string, object>;
            return res;
        }
    }
}
