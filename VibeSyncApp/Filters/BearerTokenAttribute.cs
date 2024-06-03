using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace VibeSyncApp.Filters
{
    public class BearerTokenAttribute : Attribute, IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Executed after the action method is invoked
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Executed before the action method is invoked
            //var hasExcludeAttribute = context.ActionDescriptor.EndpointMetadata.Any(em => em.GetType() == typeof(ExcludeTokenAuthenticationAttribute));

            //if (!hasExcludeAttribute && (!context.HttpContext.Request.Headers.TryGetValue("Authorization", out StringValues authorization) ||
            //        !authorization.ToString().StartsWith("Bearer ")))
            //{
            //    context.Result = new UnauthorizedResult();
            //}
        }
    }
}