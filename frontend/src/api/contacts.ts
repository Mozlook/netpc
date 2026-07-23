import { apiClient } from "./client";
import { API_PATHS } from "./paths";
import type {
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
