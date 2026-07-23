import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "text-blue-600 font-medium"
    : "text-gray-700 hover:text-blue-600";
}

function Layout() {
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200">
        <nav className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
          <NavLink to="/" end className={navLinkClass}>
            Kontakty
          </NavLink>
          {status === "authenticated" && (
            <NavLink to="/contacts/new" className={navLinkClass}>
              Dodaj kontakt
            </NavLink>
          )}

          <div className="ml-auto flex items-center gap-4">
            {status === "authenticated" && (
              <>
                <span className="text-gray-500">{user?.email}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Wyloguj
                </button>
              </>
            )}
            {status === "anonymous" && (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Zaloguj
                </NavLink>
                <NavLink to="/register" className={navLinkClass}>
                  Rejestracja
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
