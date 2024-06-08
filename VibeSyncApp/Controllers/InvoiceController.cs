using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSyncApp.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class InvoiceController : Controller
    {
        private readonly IMediator _mediator;

        public InvoiceController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpGet]
        public async Task<IActionResult> GetInvoiceByPaymentId([FromQuery] string paymentId)
        {
            var res = await _mediator.Send(new GetInvoiceModel { PaymentId = paymentId }).ConfigureAwait(false);
            return File(res, "application/pdf", $"Invoice_{paymentId}.pdf");
        }
        [HttpGet]
        public async Task<IActionResult> GetDirectoryPath([FromQuery] string paymentId)
        {
            var currentDirectory = Directory.GetCurrentDirectory();
            var combinedPath = Path.Combine(currentDirectory, "libwkhtmltox.dll");
            return new OkObjectResult(combinedPath);
        }
    }
}
