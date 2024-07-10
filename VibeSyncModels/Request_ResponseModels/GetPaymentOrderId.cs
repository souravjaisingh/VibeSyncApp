using MediatR;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetPaymentOrderId : IRequest<GetPaymentInitiationDetails>
    {
        public long UserId { get; set; }
        public decimal Amount { get; set; }
        public decimal TotalAmount { get; set; }
        public long EventId { get; set; }
        public long DjId { get; set; }
        public string SongId { get; set; }
        public string SongName { get; set; }
        public string ArtistId { get; set; }
        public string ArtistName { get; set; }
        public string AlbumName { get; set; }
        public string AlbumImage { get; set; }
        public string MicAnnouncement { get; set; }
        public string ScreenAnnouncement { get; set; }

    }
}