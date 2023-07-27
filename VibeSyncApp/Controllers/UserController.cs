using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using VibeSync.DAL.Models;
using VibeSync.DAL.Models.DAL;

namespace VibeSyncApp.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IIndexRepository _iRepository;
        private readonly IUserRepository _user;
        private readonly IMapper _mapper;

        public UserController(ILogger<UserController> logger,
            IIndexRepository irepository,
            IUserRepository user,
            IMapper mapper)
        {
            _logger = logger;
            _iRepository = irepository;
            _user = user;
            _mapper = mapper;
        }
        [HttpGet]
        public IEnumerable<Models.User> GetUsers()
        {
            return _mapper.Map<IEnumerable<Models.User>>(_iRepository.GetUsers());
        }
        [HttpGet]
        public Models.User GetUserById(int id)
        {
            return _mapper.Map<Models.User>(_user.GetUserById(id));
        }
        [HttpDelete]
        public HttpStatusCode DeleteUser(int id)
        {
            var isDeleted = _user.DeleteUser(id);
            return isDeleted > 0 ? HttpStatusCode.OK : HttpStatusCode.BadRequest;
        }
    }
}
