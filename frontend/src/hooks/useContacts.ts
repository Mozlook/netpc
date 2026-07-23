import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContact,
  deleteContact,
  getContact,
  getContacts,
  updateContact,
} from "../api/contacts";
import type { ContactUpdateRequest } from "../types/contact";

// Query-key factory — single source of truth for cache reads and invalidation.
export const contactKeys = {
  all: ["contacts"] as const,
  detail: (id: string | number) => ["contacts", id] as const,
};

export function useContacts() {
  return useQuery({
    queryKey: contactKeys.all,
    queryFn: getContacts,
  });
}

export function useContact(id: string | undefined) {
  return useQuery({
    queryKey: contactKeys.detail(id ?? ""),
    queryFn: () => getContact(id!),
    // id may be undefined (route param) — keep the query idle until it's set.
    enabled: id !== undefined,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ContactUpdateRequest }) =>
      updateContact(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(id) });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      // The contact is gone — drop its detail cache to avoid a 404 refetch.
      queryClient.removeQueries({ queryKey: contactKeys.detail(id) });
    },
  });
}
