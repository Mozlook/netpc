namespace ContactsApi.Controllers;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ContactsApi.Data;
using ContactsApi.DTOs;
using ContactsApi.Models;
using Microsoft.AspNetCore.Authorization;
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

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ContactDetailsResponse>> Create(ContactCreateRequest request)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(c =>
            c.Id == request.CategoryId
        );
        if (category is null)
        {
            return BadRequest("Podana kategoria nie istnieje.");
        }

        Subcategory? subcategory = null;
        if (request.SubcategoryId is not null)
        {
            subcategory = await _context.Subcategories.FirstOrDefaultAsync(s =>
                s.Id == request.SubcategoryId
            );
            if (subcategory is null)
            {
                return BadRequest("Podana podkategoria nie istnieje.");
            }
        }

        if (category.Id == 1)
        {
            if (request.SubcategoryId is null || request.CustomSubcategory is not null)
            {
                return BadRequest("Kategoria 'służbowy' wymaga podania podkategorii ze słownika.");
            }
        }
        else if (category.Id == 3)
        {
            if (request.CustomSubcategory is null || request.SubcategoryId is not null)
            {
                return BadRequest("Kategoria 'inny' wymaga podania własnej podkategorii.");
            }
        }
        else
        {
            if (request.SubcategoryId is not null || request.CustomSubcategory is not null)
            {
                return BadRequest("Kategoria 'prywatny' nie powinna mieć podkategorii.");
            }
        }

        var existingContact = await _context.Contacts.FirstOrDefaultAsync(c =>
            c.Email == request.Email
        );
        if (existingContact is not null)
        {
            return Conflict();
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

        var newContact = new Contact
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = passwordHash,
            Phone = request.Phone,
            DateOfBirth = request.DateOfBirth,
            CategoryId = request.CategoryId,
            SubcategoryId = request.SubcategoryId,
            CustomSubcategory = request.CustomSubcategory,
            OwnerId = userId,
        };

        _context.Contacts.Add(newContact);
        await _context.SaveChangesAsync();

        var response = new ContactDetailsResponse(
            newContact.Id,
            newContact.FirstName,
            newContact.LastName,
            newContact.Email,
            category.Name,
            subcategory?.Name,
            newContact.CustomSubcategory,
            newContact.Phone,
            newContact.DateOfBirth,
            newContact.OwnerId
        );

        return Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        var contact = await _context.Contacts.FirstOrDefaultAsync(c => c.Id == id);

        if (contact is null)
        {
            return NotFound();
        }

        var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

        if (contact.OwnerId != userId)
        {
            return Forbid();
        }

        _context.Contacts.Remove(contact);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<ContactDetailsResponse>> Update(
        int id,
        ContactUpdateRequest request
    )
    {
        var contact = await _context.Contacts.FirstOrDefaultAsync(c => c.Id == id);

        if (contact is null)
        {
            return NotFound();
        }

        var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

        if (contact.OwnerId != userId)
        {
            return Forbid();
        }

        var category = await _context.Categories.FirstOrDefaultAsync(c =>
            c.Id == request.CategoryId
        );

        if (category is null)
        {
            return BadRequest();
        }

        Subcategory? subcategory = null;
        if (request.SubcategoryId is not null)
        {
            subcategory = await _context.Subcategories.FirstOrDefaultAsync(s =>
                s.Id == request.SubcategoryId
            );
            if (subcategory is null)
            {
                return BadRequest();
            }
        }

        if (category.Id == 1)
        {
            if (request.SubcategoryId is null || request.CustomSubcategory is not null)
            {
                return BadRequest("Kategoria 'służbowy' wymaga podania podkategorii ze słownika.");
            }
        }
        else if (category.Id == 3)
        {
            if (request.CustomSubcategory is null || request.SubcategoryId is not null)
            {
                return BadRequest("Kategoria 'inny' wymaga podania własnej podkategorii.");
            }
        }
        else
        {
            if (request.SubcategoryId is not null || request.CustomSubcategory is not null)
            {
                return BadRequest("Kategoria 'prywatny' nie powinna mieć podkategorii.");
            }
        }

        var emailConflict = await _context.Contacts.FirstOrDefaultAsync(c =>
            c.Email == request.Email && c.Id != id
        );

        if (emailConflict is not null)
        {
            return Conflict();
        }

        contact.FirstName = request.FirstName;
        contact.LastName = request.LastName;
        contact.Email = request.Email;
        contact.Phone = request.Phone;
        contact.DateOfBirth = request.DateOfBirth;
        contact.CategoryId = request.CategoryId;
        contact.SubcategoryId = request.SubcategoryId;
        contact.CustomSubcategory = request.CustomSubcategory;

        if (request.Password is not null)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            contact.PasswordHash = passwordHash;
        }

        await _context.SaveChangesAsync();

        var response = new ContactDetailsResponse(
            contact.Id,
            contact.FirstName,
            contact.LastName,
            contact.Email,
            category.Name,
            subcategory?.Name,
            contact.CustomSubcategory,
            contact.Phone,
            contact.DateOfBirth,
            contact.OwnerId
        );

        return Ok(response);
    }
}
