using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.BackgroundServices
{
    public class DatabaseKeepAliveService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<DatabaseKeepAliveService> _logger;

        public DatabaseKeepAliveService(IServiceScopeFactory scopeFactory, ILogger<DatabaseKeepAliveService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Running database keep-alive job at: {time}", DateTimeOffset.Now);

                using (var scope = _scopeFactory.CreateScope())
                {
                    var _context = scope.ServiceProvider.GetRequiredService<VibeSyncContext>();
                    var _payment = scope.ServiceProvider.GetRequiredService<IPaymentCommandRepository>();
                    var _songCommandRepository = scope.ServiceProvider.GetRequiredService<ISongCommandRepository>();

                    try
                    {
                        var query = await _context.SongHistories.Join(
                            _context.Payments,
                            songHistory => songHistory.Id,
                            payment => payment.SongHistoryId,
                            (songHistory, payment) => new SongHistoryModel
                            {
                                Id = songHistory.Id,
                                DjId = songHistory.DjId,
                                EventId = songHistory.EventId,
                                AlbumName = songHistory.AlbumName,
                                ArtistId = songHistory.ArtistId,
                                ArtistName = songHistory.ArtistName,
                                CreatedBy = songHistory.CreatedBy,
                                CreatedOn = songHistory.CreatedOn,
                                Image = songHistory.Image,
                                PaymentDateTime = payment.ModifiedOn,
                                PaymentId = payment.PaymentId,
                                SongName = songHistory.SongName,
                                SongId = songHistory.SongId,
                                SongStatus = songHistory.SongStatus,
                                TotalAmount = payment.TotalAmount,
                                UserId = songHistory.UserId
                            })
                            .Where(x => x.SongStatus == "Pending")
                            .ToListAsync();

                        var currentTime = DateTime.Now;

                        foreach (var item in query)
                        {
                            if (item.PaymentDateTime.HasValue)
                            {
                                var timeDifference = currentTime - item.PaymentDateTime.Value;
                                if (timeDifference.TotalMinutes > 30)
                                {
                                    _logger.LogInformation("Refunding for: " + Newtonsoft.Json.JsonConvert.SerializeObject(item));

                                    await _payment.RefundPayment(item.PaymentId, (decimal)item.TotalAmount, 0);

                                    item.SongStatus = "Refunded";
                                    await _songCommandRepository.UpdateSongHistory(item);

                                    _logger.LogInformation("Refund complete: " + Newtonsoft.Json.JsonConvert.SerializeObject(item));
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "An error occurred while refunding.");
                    }
                }
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
}
