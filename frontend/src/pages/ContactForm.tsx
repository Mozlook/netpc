import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDictionary } from "../hooks/useDictionary";
import { useCreateContact } from "../hooks/useContacts";
import { ApiError } from "../api/client";
import { PASSWORD_HINT, PASSWORD_REGEX } from "../lib/password";

function ContactForm() {
  const { id } = useParams();
  const isEdit = id !== undefined;

  const { categories, subcategories, isLoading, isError } = useDictionary();
  const createContact = useCreateContact();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (isEdit) {
    return (
      <p className="text-gray-500">
        Edycja kontaktu (id = {id}) — do zrobienia w etapie 8.
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-gray-500">Ładowanie słownika...</p>;
  }
  if (isError) {
    return (
      <p className="text-red-600">
        Nie udało się pobrać kategorii/podkategorii.
      </p>
    );
  }

  const selectedCategory = categories?.find((c) => String(c.id) === categoryId);
  const subcategoriesForCategory =
    subcategories?.filter((s) => String(s.categoryId) === categoryId) ?? [];
  const showSubcategorySelect = subcategoriesForCategory.length > 0;
  const showCustomSubcategory = selectedCategory?.name.toLowerCase() === "inny";

  function handleCategoryChange(value: string) {
    setCategoryId(value);
    setSubcategoryId("");
    setCustomSubcategory("");
  }

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError("Wybierz kategorię.");
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      setError(PASSWORD_HINT);
      return;
    }
    if (showSubcategorySelect && !subcategoryId) {
      setError("Wybierz podkategorię.");
      return;
    }
    if (showCustomSubcategory && !customSubcategory.trim()) {
      setError("Podaj podkategorię.");
      return;
    }

    createContact.mutate(
      {
        firstName,
        lastName,
        email,
        password,
        phone,
        dateOfBirth,
        categoryId: Number(categoryId),
        subcategoryId: showSubcategorySelect ? Number(subcategoryId) : null,
        customSubcategory: showCustomSubcategory ? customSubcategory : null,
      },
      {
        onSuccess: (created) => navigate(`/contacts/${created.id}`),
        onError: (err) =>
          setError(
            err instanceof ApiError
              ? err.message
              : "Wystąpił błąd. Spróbuj ponownie.",
          ),
      },
    );
  }

  const inputClass = "rounded border border-gray-300 px-3 py-2";

  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-4 text-lg font-semibold">Nowy kontakt</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Imię</span>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Nazwisko</span>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Hasło</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            maxLength={64}
            autoComplete="new-password"
            className={inputClass}
          />
          <span className="text-xs text-gray-500">{PASSWORD_HINT}</span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Telefon</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Data urodzenia</span>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Kategoria</span>
          <select
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">— wybierz —</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {showSubcategorySelect && (
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700">Podkategoria</span>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">— wybierz —</option>
              {subcategoriesForCategory.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {showCustomSubcategory && (
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700">Podkategoria</span>
            <input
              value={customSubcategory}
              onChange={(e) => setCustomSubcategory(e.target.value)}
              required
              className={inputClass}
            />
          </label>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={createContact.isPending}
          className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {createContact.isPending ? "Zapisywanie..." : "Zapisz kontakt"}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
