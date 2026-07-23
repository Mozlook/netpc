namespace ContactsApi.Controllers;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ContactsApi.Data;
using ContactsApi.DTOs;
using ContactsApi.Models;
using ContactsApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthController(AppDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
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

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser is null)
        {
            return Unauthorized("Nieprawidłowy email lub hasło.");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, existingUser.PasswordHash))
        {
            return Unauthorized("Nieprawidłowy email lub hasło.");
        }

        var token = _tokenService.GenerateToken(existingUser);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddHours(1),
        };

        Response.Cookies.Append(CookieNames.AccessToken, token, cookieOptions);
        return Ok(new AuthResponse(existingUser.Id, existingUser.Email));
    }

    [HttpPost("logout")]
    [Authorize]
    public ActionResult Logout()
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
        };
        Response.Cookies.Delete(CookieNames.AccessToken, cookieOptions);
        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AuthResponse>> Me()
    {
        var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);
        var user = await _context.Users.FindAsync(userId);

        if (user is null)
        {
            return NotFound();
        }

        return Ok(new AuthResponse(user.Id, user.Email));
    }
}
