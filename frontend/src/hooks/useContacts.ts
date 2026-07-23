import { useQuery } from "@tanstack/react-query";
import { getContact, getContacts } from "../api/contacts";

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

// Hook pobierający szczegóły jednego kontaktu.
// id bywa undefined (parametr trasy) — wtedy zapytanie jest wstrzymane (enabled: false).
export function useContact(id: string | undefined) {
  return useQuery({
    queryKey: contactKeys.detail(id ?? ""),
    queryFn: () => getContact(id!),
    enabled: id !== undefined,
  });
}
