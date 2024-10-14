using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using VibeSync.DAL.Iservices;
using VibeSyncModels.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Text.Json;

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
            _httpClient.DefaultRequestHeaders.Add("authkey", msg91AuthKey);
        }
        public async Task SendWhatAppNotification(string phoneNumber, WhatsAppMsgTemplate msgTemplate)
        {
            try
            {
                if (phoneNumber.StartsWith('+'))
                    phoneNumber = phoneNumber.Substring(3);
                var payload = GetPayload(phoneNumber, msgTemplate.ToString());
                var jsonString = System.Text.Json.JsonSerializer.Serialize(payload, new JsonSerializerOptions
                {
                    WriteIndented = true // Makes the JSON more readable (optional)
                });
                var requestContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/", requestContent);
                response.EnsureSuccessStatusCode();
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"whatsapp msg sent with response :: {responseContent}");
            }catch(Exception ex)
            {
                _logger.LogError($"Error while sending whatsapp msg :: {ex}");

            }
        }
        private object GetPayload(string phoneNumber, string templateName)
        {
            object components;
            if (templateName != WhatsAppMsgTemplate.received_template.ToString() &&
                templateName != WhatsAppMsgTemplate.accepted_new_template.ToString())
            {
                components = new
                {
                    button_1 = new
                    {
                        subtype = "url",
                        type = "text",
                        value = "<xyz>"
                    }
                };
            }
            else
            {
                components = new { };
            }

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
                        name = templateName,
                        language = new
                        {
                            code = "en",
                            policy = "deterministic"
                        },
                        to_and_components = new[]
                        {
                            new
                            {
                                to = new[] { phoneNumber },
                                 components
                            }
                        }           
                    }
                }
            };

            return jsonPayload;
        }
    }
}
