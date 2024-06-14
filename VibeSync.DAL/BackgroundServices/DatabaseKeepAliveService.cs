using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace VibeSync.DAL.BackgroundServices
{
    public class DatabaseKeepAliveService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DatabaseKeepAliveService> _logger;

        public DatabaseKeepAliveService(IServiceProvider serviceProvider, ILogger<DatabaseKeepAliveService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Running database keep-alive job at: {time}", DateTimeOffset.Now);

                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<VibeSync.DAL.DBContext.VibeSyncContext>();

                    try
                    {
                        var result = await dbContext.Users.FirstOrDefaultAsync();

                        _logger.LogInformation("Database keep-alive query executed successfully.");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "An error occurred while executing the keep-alive query.");
                    }
                }

                await Task.Delay(TimeSpan.FromMinutes(15), stoppingToken);
            }
        }
    }

}
