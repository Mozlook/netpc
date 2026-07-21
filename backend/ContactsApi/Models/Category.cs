namespace ContactsApi.Models;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }

    public ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();
    public ICollection<Contact> Contacts { get; set; } = new List<Contact>();
}
