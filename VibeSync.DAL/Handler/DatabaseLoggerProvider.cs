using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

namespace VibeSync.DAL.Handler
{
    public class DatabaseLoggerProvider : ILoggerProvider
    {
        private readonly Func<LogLevel, bool> _filter;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DatabaseLoggerProvider(Func<LogLevel, bool> filter, IServiceScopeFactory scopeFactory, IHttpContextAccessor httpContextAccessor)
        {
            _filter = filter;
            _scopeFactory = scopeFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        public ILogger CreateLogger(string categoryName)
        {
            return new DatabaseLogger(categoryName, _filter, _scopeFactory, _httpContextAccessor);
        }

        public void Dispose()
        {
            // No resources to dispose
        }
    }


}
