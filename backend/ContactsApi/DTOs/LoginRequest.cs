using System.ComponentModel.DataAnnotations;

namespace ContactsApi.DTOs;

public record LoginRequest([property: Required] string Email, [property: Required] string Password);
