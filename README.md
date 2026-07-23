## Tech stack / libraries

### Backend

- **ASP.NET Core 10** – Web API (controllers)
- **Entity Framework Core 10** + **Microsoft.EntityFrameworkCore.Sqlite** – ORM and database
- **BCrypt.Net-Next** – password hashing
- **Microsoft.AspNetCore.Authentication.JwtBearer** / **System.IdentityModel.Tokens.Jwt** – JWT issuing and validation
- **Swashbuckle.AspNetCore** – Swagger/OpenAPI docs (development only)

### Frontend

- **React 19** + **TypeScript**
- **Vite** – build tool / dev server
- **React Router 7** (`react-router-dom`) – routing
- **TanStack Query 5** (`@tanstack/react-query`) – server-state / caching
- **Tailwind CSS v4** (`@tailwindcss/vite`) – styling
- Native `fetch` wrapped in a small custom client

---

## Running with Docker (recommended)

Everything runs with a single command from the repository root:

```bash
docker compose up --build
```

Then open **http://localhost:8080**.

- `nginx` (frontend service) serves the built SPA and reverse-proxies `/api/*` to the
  backend, so the whole app is same-origin on port `8080` (no CORS needed).
- The backend applies EF Core migrations and seeds the category dictionary on startup.
- The SQLite database lives on a named volume (`contacts-data`), so it survives
  `stop` / `restart` / `down`. It is only wiped by `docker compose down -v`.
- `JWT_KEY` has a default in `docker-compose.yml` and can be overridden via the environment.

---

## Local development

### Backend (`backend/ContactsApi`)

Requirements: .NET 10 SDK.

Secrets are read from user-secrets (not committed). Set them once:

```bash
cd backend/ContactsApi
dotnet user-secrets set "Jwt:Key" "<base64 key, at least 32 bytes>"
dotnet user-secrets set "Jwt:Issuer" "ContactsApi"
dotnet user-secrets set "Jwt:Audience" "ContactsApi"
dotnet run
```

- The app auto-applies migrations on startup (creates/seeds `contacts.db`). To recreate
  the database manually you can also run `dotnet ef database update`.
- API: `http://localhost:5234`, Swagger UI at `http://localhost:5234/swagger`.

### Frontend (`frontend`)

Requirements: Node 22+.

```bash
cd frontend
npm install
npm run dev
```

- Dev server: `http://localhost:5173` (allowed by the backend CORS policy).
- API base URL defaults to `http://localhost:5234`; override with `VITE_API_BASE_URL`.
- Production build: `npm run build` (output in `dist/`).

---

## Architecture

### Backend (`backend/ContactsApi`)

- **`Program.cs`** – composition root: registers controllers, EF Core (SQLite), CORS,
  JWT bearer auth (reads the token from the `access_token` cookie, `MapInboundClaims = false`),
  builds the request pipeline, and applies migrations on startup.
- **Controllers**
  - `AuthController` – `Register`, `Login` (sets the auth cookie), `Logout` (clears it), `Me`.
  - `ContactController` – `GetAll`, `GetById` (both public), `Create`, `Update`, `Delete`
    (all `[Authorize]`; `Update`/`Delete` verify ownership → IDOR protection).
  - `CategoryController` / `SubcategoryController` – `GetAll`, public dictionary lookups.
- **`Data/AppDbContext`** – `DbSet`s and `OnModelCreating`: unique indexes on user/contact
  email, seed data for categories/subcategories, and `DeleteBehavior.Restrict` on
  Contact → Category.
- **`Services/ITokenService` / `TokenService`** – `GenerateToken(User)` builds a signed JWT
  whose `sub` claim carries the user id (used server-side for auth and ownership checks).
- **`Models`** – `User`, `Contact`, `Category`, `Subcategory` (EF entities).
- **`DTOs`** – request/response records (e.g. `ContactCreateRequest`, `ContactDetailsResponse`).
- **`Constants/CookieNames`** – the `access_token` cookie name.

### Frontend (`frontend/src`)

- **`api/`** – `client.ts` (`apiClient` fetch wrapper with `credentials: "include"` +
  `ApiError`), `paths.ts` (endpoint paths), and per-resource callers `auth.ts`,
  `contacts.ts`, `dictionary.ts`.
- **`context/AuthContext.tsx`** – `AuthProvider` + `useAuth`; keeps UI auth state and
  restores the session on load via `GET /api/auth/me` (the token cookie is invisible to JS).
- **`hooks/`** – `useContacts.ts` (`useContacts`, `useContact`, `useCreateContact`,
  `useUpdateContact`, `useDeleteContact`, `contactKeys`) and `useDictionary.ts`.
- **`components/`** – `Layout` (auth-aware navigation) and `ProtectedRoute` (login gate).
- **`pages/`** – `ContactList`, `ContactDetails`, `ContactForm` (shared create/edit),
  `LoginPage`, `RegisterPage`, `NotFound`.
- **`types/`** – TypeScript types mirroring the backend DTOs. **`lib/password.ts`** –
  shared password rule.
