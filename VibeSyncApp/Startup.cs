using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.Net.Http;
using System.Reflection;
using VibeSync.DAL.DBContext;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncApp.Filters;
using VibeSyncApp.Middleware;
using VibeSyncModels;
using VibeSyncModels.Middleware;

namespace VibeSyncApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllersWithViews(options =>
            {
                options.Filters.Add<ValidateModelStateAttribute>();
                options.Filters.Add(new BearerTokenAttribute());
            });
            services.AddCors(options =>
            {
                options.AddPolicy(name: "CorsPolicyName",
                                  builder =>
                                  {
                                      builder.WithOrigins(Configuration.GetSection("CORSSetting:AllowedOrigin").Get<string[]>())
                                       .WithMethods(Configuration.GetSection("CORSSetting:AllowedMethod").Get<string[]>())
                                       .WithHeaders(Configuration.GetSection("CORSSetting:AllowedHeader").Get<string[]>());
                                  });
            });
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MappingProfile());
            });
            IMapper mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);
            services.AddMediatR(typeof(Startup).GetTypeInfo().Assembly);
            services.AddMediatR(typeof(UserCommandRepository).GetTypeInfo().Assembly);
            //string connection = Configuration.GetConnectionString("VibeSyncDB");
            //services.AddDbContext<VibeSyncContext>(options => options.UseSqlServer(connection));
            services.AddScoped<IDBContextFactory, DBContextFactory>();
            services.AddScoped<IUserCommandRepository, UserCommandRepository>();
            services.AddScoped<IUserQueryRepository, UserQueryRepository>();
            services.AddScoped<IEventQueryRepository, EventQueryRepository>();
            services.AddScoped<ISongQueryRepository, SongQueryRepository>();
            services.AddScoped<IEventCommandRepository, EventCommandRepository>();
            services.AddScoped<IDjCommandRepository, DjCommandRepository>();
            services.AddScoped<IPaymentQueryRepository, PaymentQueryRepository>();
            services.AddScoped<IPaymentCommandRepository, PaymentCommandRepository>();
            services.AddScoped<IDjQueryRepository, DjQueryRepository>();
            services.AddScoped<ISongCommandRepository, SongCommandRepository>();
            services.AddSingleton<HttpClient>();
            services.AddSentryTunneling();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Vibe Sync", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Vibe Sync");
                });
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseMiddleware<TokenValidationMiddleware>();
            app.UseHttpsRedirection();
            app.UseCors("CorsPolicyName");
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseMiddleware<ErrorHandlingMiddleware>();
            app.UseRouting();

            app.UseSentryTunneling();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
