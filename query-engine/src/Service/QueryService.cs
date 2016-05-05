namespace QueryEngine.Service
{
    using System;
    using System.Reflection;
    using QueryEngine.Model;

    public class QueryService
    {
        CompileService _compiler;

        public QueryService(CompileService compiler)
        {
            _compiler = compiler;
        }

        public string ExecuteQuery(QueryInput input)
        {
            var programType = _compiler.LoadProgram(input.Source, input.ConnectionString);
            var method = programType.GetMethod("Main");
            var programInstance = Activator.CreateInstance(programType);
            var res = method.Invoke(programInstance, new object[] { }) as string;
            return res;
        }
    }
}
