﻿using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetEventsByUserId : IRequest<List<EventsDetails>>
    {
        public long UserId { get; set; }
    }
}