using System.ComponentModel.DataAnnotations;

namespace ContactsApi.DTOs;

public record RegisterRequest(
    [property: Required] [property: EmailAddress] string Email,
    [property: Required]
    [property: StringLength(64, MinimumLength = 8)]
    [property: RegularExpression(
        @"^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$",
        ErrorMessage = "Hasło musi zawierać min. 8 znaków, jedną wielką literę, cyfrę i znak specjalny."
    )]
        string Password
);
