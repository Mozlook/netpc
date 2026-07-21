namespace ContactsApi.Models;

public class Contact
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string Phone { get; set; }
    public required DateTime DateOfBirth { get; set; }

    public required int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public int? SubcategoryId { get; set; }
    public Subcategory? Subcategory { get; set; }

    public string? CustomSubcategory { get; set; }

    public required int OwnerId { get; set; }
    public User Owner { get; set; } = null!;
}
