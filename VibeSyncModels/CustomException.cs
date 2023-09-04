using System.Runtime.Serialization;
using System;

namespace VibeSyncModels
{
    /// <summary>
    /// Custom Exception
    /// </summary>
    /// <seealso cref="System.Exception" />
    [Serializable]
    public class CustomException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NotFoundException" /> class.
        /// </summary>
        public CustomException() : base() { }

        /// <summary>
        /// Initializes a new instance of the <see cref="CustomException"/> class.
        /// </summary>
        /// <param name="message">The message that describes the error.</param>
        public CustomException(string message) : base(message)
        {
            Data.Add("ExceptionType", "CustomException");
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CustomException"/> class.
        /// </summary>
        /// <param name="exception">The exception.</param>
        public CustomException(Exception exception) : base(exception.Message, exception) { }

        /// <summary>
        /// Initializes a new instance of the <see cref="CustomException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="source">The source.</param>
        public CustomException(string message, string source) : base(message) { }

        /// <summary>
        /// Initializes a new instance of the <see cref="CustomException"/> class.
        /// </summary>
        /// <param name="info">The information.</param>
        /// <param name="context">The context.</param>
        protected CustomException(SerializationInfo info, StreamingContext context) : base(info, context)
        {

        }
    }
}
