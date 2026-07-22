namespace ContactsApi.Controllers;

using ContactsApi.Data;
using ContactsApi.DTOs;
using ContactsApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser is not null)
        {
            return Conflict("Użytkownik z tym adresem email już istnieje.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var newUser = new User { Email = request.Email, PasswordHash = passwordHash };

        _context.Users.Add(newUser);

        await _context.SaveChangesAsync();

        var response = new AuthResponse(newUser.Id, newUser.Email);

        return CreatedAtAction(nameof(Register), response);
    }
}
