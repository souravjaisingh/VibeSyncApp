using DinkToPdf;
using DinkToPdf.Contracts;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    internal class InvoiceHandler : IRequestHandler<GetInvoiceModel, byte[]>
    {
        private readonly IConverter _converter;
        private readonly IPaymentQueryRepository _paymentQueryRepository;
        private readonly IWebHostEnvironment _env;

        public InvoiceHandler(IConverter converter, IPaymentQueryRepository paymentQueryRepository, IWebHostEnvironment env)
        {
            _converter = converter;
            _paymentQueryRepository = paymentQueryRepository;
            _env = env;
        }
        public async Task<byte[]> Handle(GetInvoiceModel request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.PaymentId))
                throw new CustomException("PaymentId is required");
            var invoiceDetails = await _paymentQueryRepository.GetInvoiceDetails(request.PaymentId);
            var htmlContent = GenerateInvoiceHtml(invoiceDetails);

            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings() { Top = 5, Right = 5, Bottom = 10, Left = 5 },
                DocumentTitle = "Tax Invoice"
        },
                Objects = {
                new ObjectSettings() {
                    PagesCount = true,
                    HtmlContent = htmlContent,
                    WebSettings = { DefaultEncoding = "utf-8", LoadImages = true, EnableIntelligentShrinking = true }
                }
                }
            };

            return await Task.Run(() => _converter.Convert(pdf));
        }
        private string GenerateInvoiceHtml(PaymentResponseModel invoice)
        {
            var imagePath = Path.Combine(_env.ContentRootPath, "images", "VibeSyncInvoice.jpg");
            var fontBase64 = Convert.ToBase64String(File.ReadAllBytes(Path.Combine(_env.ContentRootPath, "fonts", "Roboto-Regular.ttf")));

            return $@"
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <title>Tax Invoice - VibeSync</title>
        <style>
        @font-face {{
            font-family: 'Roboto';
            src: url(data:font/ttf;base64,{fontBase64}) format('truetype');
        }}
            body {{
                font-family: 'Roboto', sans-serif;
                margin: 0;
                padding: 0;
                letter-spacing: 0.5px; /* Increase spacing between letters */
            }}
            .container {{
                width: 80%;
                margin: auto;
                padding: 20px;
            }}
            .header, .footer {{
                text-align: center;
            }}
            .header img {{
                width: 150px; /* Adjust the width as needed */
                height: auto;
                margin-bottom: 10px;
            }}
            .header h2, .header h4 {{
                margin: 0;
                font-family: 'Roboto', sans-serif;
            }}
            .header h2 {{
                color: #276EF1;
                font-size: 16pt;
            }}
            .header h4 {{
                color: #333;
                font-size: 12pt;
            }}
            .header .sub-header {{
                font-size: 10pt;
                letter-spacing: 1px; /* Increase spacing between characters */
            }}
            .content p {{
                font-size: 10pt;
                margin: 0;
                margin-bottom: 5px;
                font-family: 'Roboto', sans-serif;
                letter-spacing: 0.5px; /* Increase spacing between letters */
            }}
            .content .sub-content {{
                font-size: 9pt;
                margin: 0;
                margin-bottom: 5px;
                font-family: 'Roboto', sans-serif;
                letter-spacing: 0.5px; /* Increase spacing between letters */
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }}
            table th, table td {{
                border: 1px solid #276EF1;
                padding: 8px;
                text-align: left;
                font-family: 'Roboto', sans-serif;
                letter-spacing: 0.5px; /* Increase spacing between letters */
            }}
            table th {{
                background-color: #F7FAFC;
                font-size: 10pt;
            }}
            table td {{
                font-size: 10pt;
            }}
            .footer {{
                margin-top: 20px;
            }}
            .footer p {{
                font-size: 10pt;
                font-family: 'Roboto', sans-serif;
                letter-spacing: 0.5px; /* Increase spacing between letters */
            }}
            .footer h4 {{
                font-size: 12pt;
                font-family: 'Roboto', sans-serif;
                letter-spacing: 0.5px; /* Increase spacing between letters */
            }}
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <img src='file:///{imagePath}' alt='VibeSync Logo' /> <!-- Reference to the local logo -->
                <h2>Tax Invoice</h2>
                <h4>GSTIN <span class='sub-header'>06BJPPJ0294Q1ZI</span></h4>
            </div>
            <div class='content'>
                <p>1429/6</p>
                <p>Near Old Anaj Mandi, Ambala, HARYANA, 134003</p>
                <h4>Invoice #: <span class='sub-header'>INV-{invoice.Id}<br></span> Invoice Date: <span class='sub-header'>{invoice.CreatedOn.ToString("dd MMM yyyy")}</span></h4>
                <p class='sub-content'>Customer Details:</p>
                <p class='sub-content'>{invoice.UserName} </p>
                <p class='sub-content'>Place of Supply: 06-HARYANA</p>
                <p class='sub-content'>Reference: {invoice.PaymentId}</p>
                <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>Rate </th>
                        <th>Qty</th>
                        <th>Taxable Value</th>
                        <th>Tax Amount</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Instant Song Request</td>
                        <td>₹{Math.Round(invoice.TaxAmount.Value, 2)}</td>
                        <td>1</td>
                        <td>₹{Math.Round(invoice.TaxAmount.Value, 2)}</td>
                        <td>₹{Math.Round(invoice.TotalAmount.Value - invoice.TaxAmount.Value, 2)} (18%)</td>
                        <td>₹{Math.Round(invoice.TotalAmount.Value, 2)}</td>
                    </tr>
                    <tr>
                        <td colspan='2'>Song title: '{invoice.SongName}'</td>
                        <td colspan='5'></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan='4'></td>
                        <td>Taxable Amount</td>
                        <td>₹{Math.Round(invoice.TaxAmount.Value, 2)}</td>
                        <td>₹{Math.Round(invoice.TotalAmount.Value, 2)}</td>
                    </tr>
                    <tr>
                        <td colspan='4'></td>
                        <td>CGST 9%</td>
                        <td>₹{Math.Round(invoice.Cgst.Value, 2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan='4'></td>
                        <td>SGST 9%</td>
                        <td>₹{Math.Round(invoice.Cgst.Value, 2)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan='4'></td>
                        <td>Total</td>
                        <td colspan='2'>₹{Math.Round(invoice.TotalAmount.Value, 2)}</td>
                    </tr>
                </tfoot>
            </table>
            </div>
            <div class='footer'>
                <h4>Amount Payable: <span style='color: #131313;'>₹{invoice.TotalAmount}</span></h4>
            </div>
        </div>
    </body>
    </html>";
        }
    }
}
