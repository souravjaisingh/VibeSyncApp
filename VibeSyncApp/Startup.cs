using AutoMapper;
using DinkToPdf;
using DinkToPdf.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.IO;
using System.Net.Http;
using System.Reflection;
using VibeSync.DAL.BackgroundServices;
using VibeSync.DAL.DBContext;
using VibeSync.DAL.GoogleDriveServices;
using VibeSync.DAL.Handler;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncApp.Filters;
using VibeSyncApp.Middleware;
using VibeSyncModels;

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
            services.AddSingleton<GoogleDriveServices>();
            //string connection = Configuration.GetConnectionString("VibeSyncDB");
            //services.AddDbContext<VibeSyncContext>(options => options.UseSqlServer(connection));

            services.AddHttpContextAccessor();
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
            services.AddScoped<ISettlementsQueryRepository, SettlementsQueryRepository>();
            services.AddScoped<ISettlementsCommandRepository, SettlementsCommandRepository>();
            services.AddScoped<IGoogleDriveServices, GoogleDriveServices>(); 
            //services.AddScoped<IWeSocketQueryRepository, WebSocketQueryRepository>();
            //services.AddScoped<WebSocketHandler>();

            services.AddSingleton<HttpClient>();
            var context = new CustomAssemblyLoadContext();
            context.LoadUnmanagedLibrary(Path.Combine(Directory.GetCurrentDirectory(), "libwkhtmltox.dll"));
            services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
            services.AddDbContext<VibeSyncContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("VibeSyncDB"), sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure();
                });
            });
            //services.AddHostedService<DatabaseKeepAliveService>();
            // Configure logging
            services.AddLogging(builder =>
            {
                builder.ClearProviders();
                builder.AddProvider(new DatabaseLoggerProvider(
                    logLevel => logLevel >= LogLevel.Information,
                    services.BuildServiceProvider().GetService<IServiceScopeFactory>(),
                    services.BuildServiceProvider().GetService<IHttpContextAccessor>()));
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
            //app.UseWebSockets();
            //app.UseMiddleware<WebSocketMiddleware>();
            app.UseMiddleware<ErrorHandlingMiddleware>();
            app.UseRouting();

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
