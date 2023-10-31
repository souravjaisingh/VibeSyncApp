using MediatR;
using System.ComponentModel.DataAnnotations;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GenerateQRCodeRequestModel : IRequest<byte[]>
    {
        [Required]
        public string Url { get; set; }
        public int PixelSize { get; set; } = 10;
        public int LogoSize { get; set; } = 100;
    }
}
