using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Threading.Tasks;

namespace VibeSyncModels.Middleware
{
    /// <summary>
    /// Error Handling Middleware
    /// </summary>
    public class ErrorHandlingMiddleware
    {
        /// <summary>
        /// The next
        /// </summary>
        private readonly RequestDelegate _next;
        /// <summary>
        /// ILogger
        /// </summary>
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="ErrorHandlingMiddleware"/> class.
        /// </summary>
        /// <param name="next">The next.</param>
        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        /// <summary>
        /// Method executes on each request and response
        /// </summary>
        /// <param name="context">The context.</param>
        /// <returns>A Task representing the asynchronous operation.</returns>
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }
        /// <summary>
        /// Handles the exception asynchronous.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="ex">The ex.</param>
        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            if (ex == null) return;

            _logger.LogCritical(JsonConvert.SerializeObject(ex));
            var response = context.Response;
            context.Response.ContentType = "application/json";

            if (ex.Message.StartsWith(Constants.UserAlreadyExists))
            {
                context.Response.StatusCode = (int)HttpStatusCode.Conflict;
                await response.WriteAsync(JsonConvert.SerializeObject(new
                {
                    Errors = ex.Message
                })).ConfigureAwait(false);
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                await response.WriteAsync(JsonConvert.SerializeObject(new
                {
                    Errors = ex.Message
                })).ConfigureAwait(false);
            }
        }
    }
}
