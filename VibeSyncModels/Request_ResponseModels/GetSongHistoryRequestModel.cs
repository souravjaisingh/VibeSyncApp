﻿using MediatR;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VibeSyncModels.Request_ResponseModels
{
    /// <summary>
    /// Get Song History Request Model
    /// </summary>
    /// <seealso cref="MediatR.IRequest&lt;VibeSyncModels.Request_ResponseModels.SongHistoryResponseModel&gt;" />
    public class GetSongHistoryRequestModel :IRequest<List<SongHistoryResponseModel>>, IValidatableObject
    {
        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>
        /// The event identifier.
        /// </value>
        public long EventId { get; set; }
        /// <summary>
        /// Gets or sets the user identifier.
        /// </summary>
        /// <value>
        /// The user identifier.
        /// </value>
        public long UserId { get; set; }
        /// <summary>
        /// Determines whether the specified object is valid.
        /// </summary>
        /// <param name="validationContext">The validation context.</param>
        /// <returns>
        /// A collection that holds failed-validation information.
        /// </returns>
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if ((EventId == 0 && UserId == 0) || (EventId != 0 && UserId != 0))
            {
                yield return new ValidationResult(
                    "Either EventId or UserId must be zero, but not both.",
                    new[] { nameof(EventId), nameof(UserId) });
            }
        }

    }
}