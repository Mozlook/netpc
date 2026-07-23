import { apiClient } from "./client";
import { API_PATHS } from "./paths";
import type {
  ContactCreateRequest,
  ContactDetailsResponse,
  ContactListItemResponse,
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
