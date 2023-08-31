# VibeSyncApp

VibeSyncApp is a comprehensive application built for sending the song requests to the DJ for a particular event. It includes several components such as controllers, configuration files, entity models, request/response models, constants, and mapping profiles.

## File Structure

Here's a brief overview of the project structure:

VibeSyncApp
├── VibeSync.DAL
│   ├── DBContext
│   ├── Handler
│   ├── Helpers
│   └── Repository
├── VibeSyncApp
│   ├── ClientApp
│   ├── Controllers
│   ├── Program.cs
│   ├── Startup.cs
│   └── appsettings.json
└── VibeSyncModels
    ├── EntityModels
    ├── Request_ResponseModels
    ├── Constants.cs
    └── MappingProfile.cs
## Brief
VibeSync.DAL
The VibeSync.DAL folder encompasses the Data Access Layer, responsible for handling interactions with the database. It contains the following subfolders and files:

DBContext: This folder includes the database context setup and configuration, defining how the application communicates with the database.
Handler: This folder might include classes responsible for handling specific tasks related to database operations or data manipulation.
Helpers: Here, utility classes or methods aiding database-related tasks could be present.
Repository: This folder may contain repositories that encapsulate data access operations, providing a higher-level API for the application to interact with the database.
VibeSyncApp
The VibeSyncApp folder contains the core application components. It consists of:

ClientApp: This folder could host the frontend application if applicable, including HTML, CSS, and JavaScript resources.
Controllers: This is where the application's controllers reside, defining API endpoints and handling HTTP requests.
Program.cs: The entry point of the application, responsible for bootstrapping and starting the application.
Startup.cs: This file configures the application's services, middleware, and settings during startup.
appsettings.json: Configuration file containing application settings such as connection strings, logging configurations, and more.
VibeSyncModels
The VibeSyncModels folder encompasses various model-related components. It includes:

EntityModels: This folder could contain classes representing entities in the application's domain model, which are directly mapped to database tables.
Request_ResponseModels: This folder might include classes used for API requests and responses, often optimized for communication between the client and server.
Constants.cs: A file containing constant values used throughout the application.
MappingProfile.cs: This file could define AutoMapper mapping profiles, responsible for mapping data between different models.

## Technology Stack
- .NET 5
- Entity Framework Core 
- AutoMapper 
- FluentValidation.AspNetCore 

## Getting Started

To get started with the VibeSyncApp project, follow these steps:

1. **Clone the Repository:** Clone the VibeSyncApp project repository and open it in an IDE that supports .NET development.

2. **Restore NuGet Packages:** Make sure to restore the NuGet packages.

3. **Set Connection Strings:** Pass the separate read and write connection strings required for the project.

4. **Build the Project:** Build the project using the command: `dotnet build`

Please refer to individual files for more detailed information.
