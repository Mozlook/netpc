import { apiClient } from "./client";
import { API_PATHS } from "./paths";
import type {
  ContactCreateRequest,
  ContactDetailsResponse,
  ContactListItemResponse,
  ContactUpdateRequest,
} from "../types/contact";

export function getContacts(): Promise<ContactListItemResponse[]> {
  return apiClient.get<ContactListItemResponse[]>(API_PATHS.contacts.base);
}

export function getContact(
  id: string | number,
): Promise<ContactDetailsResponse> {
  return apiClient.get<ContactDetailsResponse>(API_PATHS.contacts.byId(id));
}

export function createContact(
  body: ContactCreateRequest,
): Promise<ContactDetailsResponse> {
  return apiClient.post<ContactDetailsResponse>(API_PATHS.contacts.base, body);
}

export function updateContact(
  id: string | number,
  body: ContactUpdateRequest,
): Promise<ContactDetailsResponse> {
  return apiClient.put<ContactDetailsResponse>(
    API_PATHS.contacts.byId(id),
    body,
  );
}

export function deleteContact(id: string | number): Promise<void> {
  return apiClient.delete<void>(API_PATHS.contacts.byId(id));
}
