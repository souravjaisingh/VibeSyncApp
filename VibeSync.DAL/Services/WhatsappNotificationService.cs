using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using VibeSync.DAL.Iservices;
using VibeSyncModels.Enums;
using Microsoft.Extensions.Configuration;
using System.Linq;
using Microsoft.Extensions.Logging;
using System;

namespace VibeSync.DAL.Services
{
    public class WhatsappNotificationService : IWhatsAppNotificationService
    {
        private readonly string msg91AuthKey;
        private readonly HttpClient _httpClient;
        private readonly ILogger<WhatsappNotificationService> _logger;

        public WhatsappNotificationService(HttpClient httpClient, IConfiguration configuration, ILogger<WhatsappNotificationService> logger)
        {
            _httpClient = httpClient;
            msg91AuthKey = configuration["Msg91:AuthKey"];
            _logger = logger;
        }
        public async Task SendWhatAppNotification(string phoneNumber, WhatsAppMsgTemplate msgTemplate)
        {
            try
            {
                var payload = GetPayload(new List<string> { phoneNumber });
                _httpClient.DefaultRequestHeaders.Add("authkey", msg91AuthKey); 
                var requestContent = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/", requestContent);
                response.EnsureSuccessStatusCode();
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"whatsapp msg sent with response :: {responseContent}");
            }catch(Exception ex)
            {
                _logger.LogError($"Error while sending whatsapp msg :: {ex}");

            }
        }
        private object GetPayload(List<string> phoneNumbers)
        {
            var jsonPayload = new
            {
                integrated_number = "918448298373",
                content_type = "template",
                payload = new
                {
                    messaging_product = "whatsapp",
                    type = "template",
                    template = new
                    {
                        name = "refund_template",
                        language = new
                        {
                            code = "en",
                            policy = "deterministic"
                        },
                        to_and_components = phoneNumbers.Select(number => new
                        {
                            to = number,
                            components = new
                            {
                                button_1 = new
                                {
                                    subtype = "url",
                                    type = "type",
                                    value = "https://vibesync.in"
                                }
                            }
                        }).ToArray()
                    }
                }
            };
            return jsonPayload;
        }
    }
}
