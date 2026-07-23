using System.ComponentModel.DataAnnotations;

namespace ContactsApi.DTOs;

public record ContactUpdateRequest(
    [Required] string FirstName,
    [Required] string LastName,
    [Required] [EmailAddress] string Email,
    [StringLength(64, MinimumLength = 8)]
    [RegularExpression(
        @"^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$",
        ErrorMessage = "Hasło musi zawierać min. 8 znaków, jedną wielką literę, cyfrę i znak specjalny."
    )]
        string? Password,
    [Required] string Phone,
    [Required] DateTime DateOfBirth,
    [Required] int CategoryId,
    int? SubcategoryId,
    string? CustomSubcategory
);
