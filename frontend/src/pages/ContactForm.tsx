import { useState } from "react";
import type { SyntheticEvent } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDictionary } from "../hooks/useDictionary";
import {
  useContact,
  useCreateContact,
  useUpdateContact,
} from "../hooks/useContacts";
import { ApiError } from "../api/client";
import { PASSWORD_HINT, PASSWORD_REGEX } from "../lib/password";
import type { CategoryResponse, SubcategoryResponse } from "../types/category";
import type { ContactDetailsResponse } from "../types/contact";

// Wartości pól formularza (wszystko jako string — tak trzymają je <input>/<select>).
interface ContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  categoryId: string;
  subcategoryId: string;
  customSubcategory: string;
}

const EMPTY_VALUES: ContactFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  dateOfBirth: "",
  categoryId: "",
  subcategoryId: "",
  customSubcategory: "",
};

function toFormValues(
  contact: ContactDetailsResponse,
  categories: CategoryResponse[],
  subcategories: SubcategoryResponse[],
): ContactFormValues {
  const category = categories.find((c) => c.name === contact.category);
  const subcategory =
    contact.subcategory && category
      ? subcategories.find(
          (s) => s.categoryId === category.id && s.name === contact.subcategory,
        )
      : undefined;

  return {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    password: "",
    phone: contact.phone,
    dateOfBirth: contact.dateOfBirth.slice(0, 10),
    categoryId: category ? String(category.id) : "",
    subcategoryId: subcategory ? String(subcategory.id) : "",
    customSubcategory: contact.customSubcategory ?? "",
  };
}

function ContactForm() {
  const { id } = useParams();
  const isEdit = id !== undefined;

  const { user } = useAuth();
  const { categories, subcategories, isLoading, isError } = useDictionary();
  const contactQuery = useContact(isEdit ? id : undefined);

  if (isLoading || (isEdit && contactQuery.isLoading)) {
    return <p className="text-gray-500">Ładowanie...</p>;
  }
  if (isError || !categories || !subcategories) {
    return (
      <p className="text-red-600">
        Nie udało się pobrać kategorii/podkategorii.
      </p>
    );
  }
  if (isEdit && contactQuery.isError) {
    return <p className="text-red-600">Nie udało się pobrać kontaktu.</p>;
  }

  if (isEdit && contactQuery.data && contactQuery.data.ownerId !== user?.id) {
    return <Navigate to={`/contacts/${id}`} replace />;
  }

  const initialValues =
    isEdit && contactQuery.data
      ? toFormValues(contactQuery.data, categories, subcategories)
      : EMPTY_VALUES;

  return (
    <ContactFormFields
      key={id ?? "new"}
      mode={isEdit ? "edit" : "create"}
      contactId={id}
      initialValues={initialValues}
      categories={categories}
      subcategories={subcategories}
    />
  );
}

interface ContactFormFieldsProps {
  mode: "create" | "edit";
  contactId?: string;
  initialValues: ContactFormValues;
  categories: CategoryResponse[];
  subcategories: SubcategoryResponse[];
}

function ContactFormFields({
  mode,
  contactId,
  initialValues,
  categories,
  subcategories,
}: ContactFormFieldsProps) {
  const navigate = useNavigate();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();

  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);

  const isEdit = mode === "edit";
  const pending = createContact.isPending || updateContact.isPending;

  const selectedCategory = categories.find(
    (c) => String(c.id) === values.categoryId,
  );
  const subcategoriesForCategory = subcategories.filter(
    (s) => String(s.categoryId) === values.categoryId,
  );
  const showSubcategorySelect = subcategoriesForCategory.length > 0;
  const showCustomSubcategory = selectedCategory?.name.toLowerCase() === "inny";

  function setField(field: keyof ContactFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleCategoryChange(value: string) {
    setValues((prev) => ({
      ...prev,
      categoryId: value,
      subcategoryId: "",
      customSubcategory: "",
    }));
  }

  function onError(err: unknown) {
    setError(
      err instanceof ApiError
        ? err.message
        : "Wystąpił błąd. Spróbuj ponownie.",
    );
  }

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setError(null);

    if (!values.categoryId) {
      setError("Wybierz kategorię.");
      return;
    }
    if (mode === "create" || values.password) {
      if (!PASSWORD_REGEX.test(values.password)) {
        setError(PASSWORD_HINT);
        return;
      }
    }
    if (showSubcategorySelect && !values.subcategoryId) {
      setError("Wybierz podkategorię.");
      return;
    }
    if (showCustomSubcategory && !values.customSubcategory.trim()) {
      setError("Podaj podkategorię.");
      return;
    }

    const subcategoryId = showSubcategorySelect
      ? Number(values.subcategoryId)
      : null;
    const customSubcategory = showCustomSubcategory
      ? values.customSubcategory
      : null;

    if (mode === "create") {
      createContact.mutate(
        {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          phone: values.phone,
          dateOfBirth: values.dateOfBirth,
          categoryId: Number(values.categoryId),
          subcategoryId,
          customSubcategory,
        },
        {
          onSuccess: (created) => navigate(`/contacts/${created.id}`),
          onError,
        },
      );
    } else {
      updateContact.mutate(
        {
          id: contactId!,
          body: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password ? values.password : null,
            phone: values.phone,
            dateOfBirth: values.dateOfBirth,
            categoryId: Number(values.categoryId),
            subcategoryId,
            customSubcategory,
          },
        },
        {
          onSuccess: () => navigate(`/contacts/${contactId}`),
          onError,
        },
      );
    }
  }

  const inputClass = "rounded border border-gray-300 px-3 py-2";

  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-4 text-lg font-semibold">
        {isEdit ? "Edycja kontaktu" : "Nowy kontakt"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Imię</span>
          <input
            value={values.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Nazwisko</span>
          <input
            value={values.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Email</span>
          <input
            type="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Hasło</span>
          <input
            type="password"
            value={values.password}
            onChange={(e) => setField("password", e.target.value)}
            required={mode === "create"}
            maxLength={64}
            autoComplete="new-password"
            className={inputClass}
          />
          <span className="text-xs text-gray-500">
            {isEdit
              ? `Zostaw puste, aby nie zmieniać. ${PASSWORD_HINT}`
              : PASSWORD_HINT}
          </span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Telefon</span>
          <input
            type="tel"
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Data urodzenia</span>
          <input
            type="date"
            value={values.dateOfBirth}
            onChange={(e) => setField("dateOfBirth", e.target.value)}
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Kategoria</span>
          <select
            value={values.categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">— wybierz —</option>
            {categories.map((c) => (
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
              value={values.subcategoryId}
              onChange={(e) => setField("subcategoryId", e.target.value)}
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
              value={values.customSubcategory}
              onChange={(e) => setField("customSubcategory", e.target.value)}
              required
              className={inputClass}
            />
          </label>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Zapisywanie..." : "Zapisz kontakt"}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
