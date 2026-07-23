import { Link, useParams } from "react-router-dom";
import { useContact } from "../hooks/useContacts";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pl-PL");
}

function ContactDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: contact, isLoading, isError, error } = useContact(id);

  if (isLoading) {
    return <p className="text-gray-500">Ładowanie kontaktu...</p>;
  }

  if (isError) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <div>
        <p className="text-red-600">
          {notFound ? "Nie znaleziono kontaktu." : error.message}
        </p>
        <Link to="/" className="text-blue-600 underline">
          Wróć do listy
        </Link>
      </div>
    );
  }

  if (!contact) {
    return null;
  }

  const isOwner = user?.id === contact.ownerId;

  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 underline">
        ← Wróć do listy
      </Link>

      <div className="mb-4 mt-2 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">
          {contact.firstName} {contact.lastName}
        </h2>
        {isOwner && (
          <Link
            to={`/contacts/${contact.id}/edit`}
            className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
          >
            Edytuj
          </Link>
        )}
      </div>

      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="text-gray-500">Email</dt>
        <dd>{contact.email}</dd>

        <dt className="text-gray-500">Telefon</dt>
        <dd>{contact.phone}</dd>

        <dt className="text-gray-500">Data urodzenia</dt>
        <dd>{formatDate(contact.dateOfBirth)}</dd>

        <dt className="text-gray-500">Kategoria</dt>
        <dd>{contact.category}</dd>

        {contact.subcategory && (
          <>
            <dt className="text-gray-500">Podkategoria</dt>
            <dd>{contact.subcategory}</dd>
          </>
        )}

        {contact.customSubcategory && (
          <>
            <dt className="text-gray-500">Podkategoria</dt>
            <dd>{contact.customSubcategory}</dd>
          </>
        )}
      </dl>
    </div>
  );
}

export default ContactDetails;
