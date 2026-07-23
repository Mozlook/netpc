import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContact, useDeleteContact } from "../hooks/useContacts";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pl-PL");
}

function ContactDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const deleteContact = useDeleteContact();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { data: contact, isLoading, isError, error } = useContact(id);

  function handleDelete() {
    if (id === undefined) return;
    if (!window.confirm("Na pewno usunąć ten kontakt?")) return;

    setDeleteError(null);
    deleteContact.mutate(id, {
      onSuccess: () => navigate("/"),
      onError: (err) =>
        setDeleteError(
          err instanceof ApiError
            ? err.message
            : "Nie udało się usunąć kontaktu.",
        ),
    });
  }

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

  // Show owner actions (edit/delete) only to the owner — UI hint; backend still enforces it.
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
          <div className="flex items-center gap-2">
            <Link
              to={`/contacts/${contact.id}/edit`}
              className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
            >
              Edytuj
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteContact.isPending}
              className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {deleteContact.isPending ? "Usuwanie..." : "Usuń"}
            </button>
          </div>
        )}
      </div>

      {deleteError && (
        <p className="mb-4 text-sm text-red-600">{deleteError}</p>
      )}

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
