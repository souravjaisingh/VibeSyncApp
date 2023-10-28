using System;

namespace VibeSyncApp.Filters
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = true, AllowMultiple = true)]
    public class ExcludeTokenAuthenticationAttribute : Attribute { }
}
