using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using Microsoft.AspNetCore.Http;

namespace VibeSync.DAL.Handler
{
    public class DatabaseLogger : ILogger
    {
        private readonly string _name;
        private readonly Func<LogLevel, bool> _filter;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DatabaseLogger(string name, Func<LogLevel, bool> filter, IServiceScopeFactory scopeFactory, IHttpContextAccessor httpContextAccessor)
        {
            _name = name;
            _filter = filter ?? (level => true);
            _scopeFactory = scopeFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            if (!IsEnabled(logLevel)) return;

            var logEntry = new VibeSyncModels.EntityModels.Log
            {
                Timestamp = DateTime.Now.ToLocalTime(),
                LogLevel = (int)logLevel,
                Message = formatter(state, exception),
                Exception = exception?.ToString(),
                Logger = _name,
                RemoteIpAddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString()
            };

            using (var scope = _scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<VibeSyncContext>();
                dbContext.Logs.Add(logEntry);
                dbContext.SaveChanges();
            }
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return _filter(logLevel);
        }

        public IDisposable BeginScope<TState>(TState state)
        {
            return null;
        }
    }


}
