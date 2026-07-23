public record ContactDetailsResponse(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string Category,
    string? Subcategory,
    string? CustomSubcategory,
    string Phone,
    DateTime DateOfBirth,
    int OwnerId
);
