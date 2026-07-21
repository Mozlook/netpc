namespace ContactsApi.Models;

public class Subcategory
{
    public int Id { get; set; }

    public required int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public required string Name { get; set; }

    public ICollection<Contact> Contacts { get; set; } = new List<Contact>();
}
