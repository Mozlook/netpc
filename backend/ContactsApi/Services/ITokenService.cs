using ContactsApi.Models;

namespace ContactsApi.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
