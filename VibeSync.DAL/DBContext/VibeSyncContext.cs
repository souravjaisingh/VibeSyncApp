using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using VibeSyncModels.EntityModels;

namespace VibeSync.DAL.DBContext
{
    public partial class VibeSyncContext : DbContext
    {
        public VibeSyncContext()
        {
        }

        public VibeSyncContext(DbContextOptions<VibeSyncContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Dj> Djs { get; set; }
        public virtual DbSet<Event> Events { get; set; }
        public virtual DbSet<Log> Logs { get; set; }
        public virtual DbSet<Payment> Payments { get; set; }
        public virtual DbSet<SongHistory> SongHistories { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();
                optionsBuilder.UseSqlServer(configuration.GetConnectionString("VibeSyncDB"), 
                    sqlServerOptionsAction: sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5, // The maximum number of retry attempts
                        maxRetryDelay: TimeSpan.FromSeconds(30), // The maximum delay between retries
                        errorNumbersToAdd: null // Additional error numbers to consider as transient
                    );
                });
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Dj>(entity =>
            {
                entity.ToTable("Dj");

                entity.Property(e => e.BankName).HasMaxLength(50);

                entity.Property(e => e.BranchName).HasMaxLength(50);

                entity.Property(e => e.CreatedBy)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.DjDescription).HasMaxLength(50);

                entity.Property(e => e.DjGenre).HasMaxLength(10);

                entity.Property(e => e.DjName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.DjPhoto).HasMaxLength(1000);

                entity.Property(e => e.Ifsccode)
                    .HasMaxLength(20)
                    .HasColumnName("IFSCCode");

                entity.Property(e => e.ModifiedBy).HasMaxLength(50);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.SocialLinks).HasMaxLength(100);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Djs)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Dj_User");
            });

            modelBuilder.Entity<Event>(entity =>
            {
                entity.ToTable("Event");

                entity.Property(e => e.CreatedBy)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.EventDescription).HasMaxLength(100);

                entity.Property(e => e.EventEndDateTime).HasColumnType("datetime");

                entity.Property(e => e.EventGenre).HasMaxLength(50);

                entity.Property(e => e.EventName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.EventStartDateTime).HasColumnType("datetime");

                entity.Property(e => e.EventStatus)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.Latitude).HasColumnType("decimal(9, 6)");

                entity.Property(e => e.Longitude).HasColumnType("decimal(9, 6)");

                entity.Property(e => e.ModifiedBy).HasMaxLength(50);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Venue)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.Dj)
                    .WithMany(p => p.Events)
                    .HasForeignKey(d => d.DjId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Event_Dj");
            });

            modelBuilder.Entity<Log>(entity =>
            {
                entity.Property(e => e.CreatedBy)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.LogDescription).HasMaxLength(500);

                entity.Property(e => e.LogName).HasMaxLength(500);

                entity.Property(e => e.ModifiedBy).HasMaxLength(50);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.HasOne(d => d.Dj)
                    .WithMany(p => p.Logs)
                    .HasForeignKey(d => d.DjId)
                    .HasConstraintName("FK_Dj_Logs");

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.Logs)
                    .HasForeignKey(d => d.EventId)
                    .HasConstraintName("FK_Event_Logs");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Logs)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_User_Logs");
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable("Payment");

                entity.Property(e => e.BidAmount).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.CreatedBy)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.ModifiedBy).HasMaxLength(50);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.OrderId)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.PaymentId).HasMaxLength(50);

                entity.Property(e => e.PaymentSource)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.PaymentStatus)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Promocode).HasMaxLength(20);

                entity.Property(e => e.Signature).HasMaxLength(150);

                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 0)");

                entity.HasOne(d => d.SongHistory)
                    .WithMany(p => p.Payments)
                    .HasForeignKey(d => d.SongHistoryId)
                    .HasConstraintName("FK_Event_SongHistory");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Payments)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Payment__UserId__5AEE82B9");
            });

            modelBuilder.Entity<SongHistory>(entity =>
            {
                entity.ToTable("SongHistory");

                entity.Property(e => e.AlbumName)
                    .HasMaxLength(80)
                    .IsUnicode(false);

                entity.Property(e => e.ArtistId)
                    .HasMaxLength(80)
                    .IsUnicode(false);

                entity.Property(e => e.ArtistName)
                    .HasMaxLength(80)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedBy)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Image)
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedBy).HasMaxLength(50);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.SongId)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.SongName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.SongStatus)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.HasOne(d => d.Dj)
                    .WithMany(p => p.SongHistories)
                    .HasForeignKey(d => d.DjId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SongHistory_Dj");

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.SongHistories)
                    .HasForeignKey(d => d.EventId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SongHistory_Event");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.SongHistories)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SongHistory_User");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.HasIndex(e => e.Email, "Unique_Email")
                    .IsUnique();

                entity.Property(e => e.CreatedBy)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Gender).HasMaxLength(10);

                entity.Property(e => e.IsSsologin).HasColumnName("IsSSOLogin");

                entity.Property(e => e.LastName).HasMaxLength(50);

                entity.Property(e => e.ModifiedBy).HasMaxLength(50);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.PhoneNumber).HasMaxLength(10);

                entity.Property(e => e.UserOrDj)
                    .IsRequired()
                    .HasMaxLength(5);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
