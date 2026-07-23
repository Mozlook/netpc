import { apiClient } from "./client";
import { API_PATHS } from "./paths";
import type { ContactListItemResponse } from "../types/contact";

export function getContacts(): Promise<ContactListItemResponse[]> {
  return apiClient.get<ContactListItemResponse[]>(API_PATHS.contacts.base);
}
