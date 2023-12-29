using AutoMapper;
using QRCoder;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    public class EventCommandRepository : IEventCommandRepository
    {
        /// <summary>
        /// The context
        /// </summary>
        private readonly VibeSyncContext _context;
        /// <summary>
        /// The mapper
        /// </summary>
        private readonly IMapper _mapper;
        /// <summary>
        /// IUserQueryRepository
        /// </summary>
        private readonly IUserQueryRepository _user;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserCommandRepository"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="mapper">The mapper.</param>
        public EventCommandRepository(IDBContextFactory context, IMapper mapper, IUserQueryRepository user)
        {
            _context = context.GetDBContext();
            _mapper = mapper;
            _user = user;
        }

        /// <summary>
        /// Creates the event.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        public async Task<long> CreateEvent(EventsDetails request)
        {
            var djId = _user.GetDjByUserId(request.UserId);
            request.DjId = djId;
            var eventDetails = _mapper.Map<Event>(request);
            eventDetails.CreatedBy = request.UserId.ToString();
            eventDetails.CreatedOn = DateTime.Now;
            _context.Events.Add(eventDetails);
            var response = await _context.SaveChangesAsync();
            if (response > 0)
                return Convert.ToInt64(eventDetails.Id);
            else
                throw new CustomException(Constants.DbOperationFailed);
        }

        public Task<byte[]> QRCodeForEvent(GenerateQRCodeRequestModel request)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(request.Url, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            Bitmap qrCodeImage = qrCode.GetGraphic(request.PixelSize); // Adjust size as needed

            // Load your logo image
            System.Drawing.Image logo = System.Drawing.Image.FromFile("Images\\VibeSync.jpg");

            // Calculate the position to place the logo at the center of the QR code
            int logoSize = request.LogoSize; // Adjust the size of the logo as needed
            int xPos = (qrCodeImage.Width - logoSize) / 2;
            int yPos = (qrCodeImage.Height - logoSize) / 2;

            // Create a Graphics object from the QR code image
            using (Graphics graphics = Graphics.FromImage(qrCodeImage))
            {
                // Draw the logo onto the QR code image
                graphics.DrawImage(logo, new Rectangle(xPos, yPos, logoSize, logoSize));
            }

            // Convert QR code image to byte array
            using (MemoryStream stream = new MemoryStream())
            {
                qrCodeImage.Save(stream, ImageFormat.Png);
                return Task.FromResult(stream.ToArray());
            }
        }

        /// <summary>
        /// Updates the event.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        /// <exception cref="VibeSyncModels.CustomException"></exception>
        public async Task<EventsDetails> UpdateEvent(EventsDetails request)
        {
            var eventEntity = _context.Events.Where(x => x.Id == request.Id).FirstOrDefault();
            if (eventEntity != null)
            {
                eventEntity.Longitude = request.Longitude;
                eventEntity.Latitude = request.Latitude;
                eventEntity.ModifiedOn = DateTime.Now;
                eventEntity.ModifiedBy = request.UserId.ToString();
                eventEntity.Venue = request.Venue;
                eventEntity.EventName = request.EventName;
                eventEntity.EventEndDateTime = request.EventEndDateTime;
                eventEntity.EventStartDateTime = request.EventStartDateTime;
                eventEntity.EventDescription = request.EventDescription;
                eventEntity.EventGenre = request.EventGenre;
                eventEntity.EventStatus = request.EventStatus;
                eventEntity.MinimumBid = request.MinimumBid;
                _context.Events.Update(eventEntity);
                // Save changes to the database
                var response = await _context.SaveChangesAsync();

                if (response > 0)
                {
                    return request;
                }
                else
                {
                    throw new CustomException(Constants.DbOperationFailed);
                }
            }
            else
            {
                throw new CustomException("Entity not found");
            }
        }
    }
}
