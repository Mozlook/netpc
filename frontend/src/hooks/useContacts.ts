import { useQuery } from "@tanstack/react-query";
import { getContacts } from "../api/contacts";

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
