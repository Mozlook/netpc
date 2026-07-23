import { Link } from "react-router-dom";
import { useContacts } from "../hooks/useContacts";

function ContactList() {
  const { data: contacts, isLoading, isError, error } = useContacts();

  if (isLoading) {
    return <p className="text-gray-500">Ładowanie kontaktów...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600">
        Nie udało się pobrać kontaktów: {error.message}
      </p>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div>
        <h2 className="mb-4 text-lg font-semibold">Lista kontaktów</h2>
        <p className="text-gray-500">Brak kontaktów.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Lista kontaktów</h2>
      <ul className="divide-y rounded border border-gray-200">
        {contacts.map((contact) => (
          <li key={contact.id}>
            <Link
              to={`/contacts/${contact.id}`}
              className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50"
            >
              <span className="font-medium">
                {contact.firstName} {contact.lastName}
              </span>
              <span className="text-sm text-gray-500">{contact.email}</span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {contact.category}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactList;
