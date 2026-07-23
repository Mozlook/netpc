namespace ContactsApi.Controllers;

using ContactsApi.Data;
using ContactsApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetAll()
    {
        var categories = await _context
            .Categories.Select(c => new CategoryResponse(c.Id, c.Name))
            .ToListAsync();

        return Ok(categories);
    }
}
