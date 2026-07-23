import { apiClient } from "./client";
import { API_PATHS } from "./paths";
import type {
  ContactDetailsResponse,
  ContactListItemResponse,
} from "../types/contact";

// Publiczna lista kontaktów (GET /contact) — dane podstawowe, bez logowania.
export function getContacts(): Promise<ContactListItemResponse[]> {
  return apiClient.get<ContactListItemResponse[]>(API_PATHS.contacts.base);
}

// Publiczne szczegóły pojedynczego kontaktu (GET /contact/{id}).
// 404 (brak kontaktu) trafi jako ApiError(404) do wywołującego.
export function getContact(
  id: string | number,
): Promise<ContactDetailsResponse> {
  return apiClient.get<ContactDetailsResponse>(API_PATHS.contacts.byId(id));
}
