namespace ContactsApi.Controllers;

using ContactsApi.Data;
using ContactsApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly AppDbContext _context;

    public ContactController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContactListItemResponse>>> GetAll()
    {
        var contacts = await _context
            .Contacts.Select(c => new ContactListItemResponse(
                Id: c.Id,
                FirstName: c.FirstName,
                LastName: c.LastName,
                Email: c.Email,
                Category: c.Category.Name
            ))
            .ToListAsync();

        return Ok(contacts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContactDetailsResponse>> GetById(int id)
    {
        var contact = await _context
            .Contacts.Where(c => c.Id == id)
            .Select(c => new ContactDetailsResponse(
                Id: c.Id,
                FirstName: c.FirstName,
                LastName: c.LastName,
                Email: c.Email,
                Category: c.Category.Name,
                Subcategory: c.Subcategory != null ? c.Subcategory.Name : null,
                CustomSubcategory: c.CustomSubcategory,
                Phone: c.Phone,
                DateOfBirth: c.DateOfBirth,
                OwnerId: c.OwnerId
            ))
            .FirstOrDefaultAsync();

        if (contact is null)
        {
            return NotFound();
        }
        return Ok(contact);
    }
}
