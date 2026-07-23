namespace ContactsApi.DTOs;

public record ContactListItemResponse(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string Category
);
