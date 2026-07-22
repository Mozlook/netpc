namespace ContactsApi.Data;

using ContactsApi.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Contact> Contacts { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Subcategory> Subcategories { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

        modelBuilder.Entity<Contact>().HasIndex(c => c.Email).IsUnique();

        modelBuilder
            .Entity<Category>()
            .HasData(
                new Category { Id = 1, Name = "służbowy" },
                new Category { Id = 2, Name = "prywatny" },
                new Category { Id = 3, Name = "inny" }
            );

        modelBuilder
            .Entity<Subcategory>()
            .HasData(
                new Subcategory
                {
                    CategoryId = 1,
                    Id = 1,
                    Name = "szef",
                },
                new Subcategory
                {
                    CategoryId = 1,
                    Id = 2,
                    Name = "klient",
                },
                new Subcategory
                {
                    CategoryId = 1,
                    Id = 3,
                    Name = "współpracownik",
                }
            );
        modelBuilder
            .Entity<Contact>()
            .HasOne(c => c.Category)
            .WithMany(cat => cat.Contacts)
            .HasForeignKey(c => c.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
