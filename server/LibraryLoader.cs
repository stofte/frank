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
        public static Lazy<LibraryLoader> Instance = new Lazy<LibraryLoader>(() => new LibraryLoader());

        public Stream AssemblyStream;
        
        protected override Assembly Load(AssemblyName assemblyName)
        {
            return base.LoadFromStream(AssemblyStream);
        }
    }
}
