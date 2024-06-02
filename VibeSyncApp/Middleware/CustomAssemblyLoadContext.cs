using System;
using System.Reflection;
using System.Runtime.Loader;

namespace VibeSyncApp.Middleware
{
    public class CustomAssemblyLoadContext : AssemblyLoadContext
    {
        /// <summary>
        /// Loads the unmanaged library.
        /// </summary>
        /// <param name="absolutePath">The absolute path.</param>
        /// <returns>IntPtr.</returns>
        public IntPtr LoadUnmanagedLibrary(string absolutePath)
        {
            return LoadUnmanagedDll(absolutePath);
        }

        /// <summary>
        /// Allows derived class to load an unmanaged library by name.
        /// </summary>
        /// <param name="unmanagedDllName">Name of the unmanaged library. Typically this is the filename without its path or extensions.</param>
        /// <returns>A handle to the loaded library, or <see cref="F:System.IntPtr.Zero" />.</returns>
        protected override IntPtr LoadUnmanagedDll(string unmanagedDllName)
        {
            return LoadUnmanagedDllFromPath(unmanagedDllName);
        }

        /// <summary>
        /// Loads the specified assembly name.
        /// </summary>
        /// <param name="assemblyName">Name of the assembly.</param>
        /// <returns>Assembly.</returns>
        /// <exception cref="System.NotImplementedException"></exception>
        protected override Assembly Load(AssemblyName assemblyName)
        {
            return null;
        }
    }

}
