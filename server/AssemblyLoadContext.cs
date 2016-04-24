using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Loader;
using System.Threading.Tasks;

namespace server
{
    public class LibraryLoader : AssemblyLoadContext
    {
        Stream _assembly;

        public LibraryLoader(Stream assm)
        {
            _assembly = assm;
        }

        protected override Assembly Load(AssemblyName assemblyName)
        {
            return base.LoadFromStream(_assembly);
        }
    }
}
