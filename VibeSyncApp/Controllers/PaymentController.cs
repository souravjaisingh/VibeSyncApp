using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;
using System;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using System.Linq;
using Newtonsoft.Json;

namespace VibeSyncApp.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        /// <summary>
        /// The mediator
        /// </summary>
        private readonly IMediator _mediator;

        /// <summary>
        /// Initializes a new instance of the <see cref="PaymentController"/> class.
        /// </summary>
        /// <param name="mediator">The mediator.</param>
        public PaymentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Gets orderID.
        /// </summary>
        /// <returns>orderId</returns>
        [HttpPost]
        public async Task<GetPaymentInitiationDetails> GetPaymentOrderIdUserDetails([FromBody] GetPaymentOrderId request)
        {
            return await _mediator.Send(request).ConfigureAwait(false);
        }

        /// <summary>
        /// Gets orderID.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<bool> PersistPaymentData([FromBody] PersistSongHistoryPaymentRequest request)
        {
            return await _mediator.Send(request).ConfigureAwait(false);
        }

        [HttpGet]
        public async Task<IActionResult> GetDjTransactions([FromQuery] GetDjPaymentsRequestModel request)
        {
            return Ok(await _mediator.Send(request));
        }


        [HttpPost]
        public IActionResult CcavRequestHandler([FromBody] PaymentRequestModel request)
        {
            var payload = new
            {
                merchant_id = 2872610, // your merchant id provided by bank
                order_id = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(), // unique order_no using current timestamp
                currency = "INR", // or any supported currency
                amount = 100.00m, // Replace with the actual amount
                redirect_url = "https://your_domain.com/ccavResponseHandler",
                cancel_url = "https://your_domain.com/ccavResponseHandler",
                merchant_param1 = "any_value",
                // Set other properties as needed
            };

            string encryptedData = EncryptCcavRequest(JsonConvert.SerializeObject(payload), request.WorkingKey);
            return Ok(new { EncryptedData = encryptedData, AccessCode = "AVHH14KI48BM55HHMB" }); // Replace 'XXXXXX' with your access code
        }

        [HttpPost("ccav_response_handler")]
        public IActionResult CcavResponseHandler([FromBody] PaymentResponseModel response)
        {
            string decryptedData = DecryptCcavResponse(response.EncResp, response.WorkingKey);
            PaymentResponseDataModel responseData = ParseResponseData(decryptedData);

            // Your logic for handling the response data here...

            return Ok(new { responseData, OrderStatus = responseData.OrderStatus });
        }

        private string EncryptCcavRequest(string payload, string workingKey)
        {
            // Convert the payload and workingKey to byte arrays
            byte[] payloadBytes = Encoding.UTF8.GetBytes(payload);
            byte[] keyBytes = Encoding.UTF8.GetBytes(workingKey);

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = keyBytes;
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;

                // Generate a random IV (Initialization Vector)
                aesAlg.GenerateIV();
                byte[] iv = aesAlg.IV;

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, iv))
                    {
                        using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                        {
                            // Write the payload data to the CryptoStream
                            csEncrypt.Write(payloadBytes, 0, payloadBytes.Length);
                        }
                    }

                    // Combine IV and encrypted data
                    byte[] encryptedBytes = iv.Concat(msEncrypt.ToArray()).ToArray();

                    // Convert to a hexadecimal string
                    string encryptedHex = BitConverter.ToString(encryptedBytes).Replace("-", "").ToLower();

                    return encryptedHex;
                }
            }
        }

        private string DecryptCcavResponse(string encResp, string workingKey)
        {
            byte[] encryptedBytes = Enumerable.Range(0, encResp.Length)
             .Where(x => x % 2 == 0)
             .Select(x => Convert.ToByte(encResp.Substring(x, 2), 16))
             .ToArray();

            // Extract IV
            byte[] iv = encryptedBytes.Take(16).ToArray();
            byte[] ciphertext = encryptedBytes.Skip(16).ToArray();

            // Convert the workingKey to a byte array
            byte[] keyBytes = Encoding.UTF8.GetBytes(workingKey);

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = keyBytes;
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;
                aesAlg.IV = iv;

                using (MemoryStream msDecrypt = new MemoryStream())
                {
                    using (ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV))
                    {
                        using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Write))
                        {
                            csDecrypt.Write(ciphertext, 0, ciphertext.Length);
                        }
                    }

                    // Convert the decrypted data to a string
                    string decryptedData = Encoding.UTF8.GetString(msDecrypt.ToArray());

                    return decryptedData;
                }
            }
        }

        private PaymentResponseDataModel ParseResponseData(string decryptedData)
        {
            // Implement your logic to parse the decrypted response data into a model
            // For example, you can use JSON deserialization or manually extract values
            return new PaymentResponseDataModel(); // Replace with your actual model
        }

        private string SerializeRequest(PaymentRequestModel request)
        {
            // Implement your logic to serialize the request model into a string
            // For example, you can use JSON serialization or manual string concatenation
            return ""; // Replace with your actual serialization logic
        }
    }
}

    public class PaymentRequestModel
    {
        // Define properties for the request model
        public string Payload { get; set; }
        public string WorkingKey { get; set; }
    }

    public class PaymentResponseModel
    {
        public string EncResp { get; set; }
    public string WorkingKey { get; internal set; }
}

public class PaymentResponseDataModel
{
    // Define properties for the response data model
    public object OrderStatus { get; internal set; }
}


