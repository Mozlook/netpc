import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h2 className="text-lg font-semibold">404 — nie znaleziono</h2>
      <p className="text-gray-600">
        Taka strona nie istnieje.{" "}
        <Link to="/" className="text-blue-600 underline">
          Wróć do listy kontaktów
        </Link>
        .
      </p>
    </div>
  );
}

export default NotFound;
