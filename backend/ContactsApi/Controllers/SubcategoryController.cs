namespace ContactsApi.Controllers;

using ContactsApi.Data;
using ContactsApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class SubcategoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public SubcategoryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubcategoryResponse>>> GetAll()
    {
        var subcategories = await _context
            .Subcategories.Select(s => new SubcategoryResponse(s.Id, s.CategoryId, s.Name))
            .ToListAsync();

        return Ok(subcategories);
    }
}
