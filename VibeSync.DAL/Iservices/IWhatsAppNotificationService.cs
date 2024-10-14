using System.Threading.Tasks;
using VibeSyncModels.Enums;

namespace VibeSync.DAL.Iservices
{
    public interface IWhatsAppNotificationService
    {
        Task SendWhatAppNotification(string phoneNumber, WhatsAppMsgTemplate msgTemplate);
    }
}
