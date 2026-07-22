using System.ComponentModel.DataAnnotations;

namespace ContactsApi.DTOs;

public record LoginRequest([Required] string Email, [Required] string Password);
