import { useQuery } from "@tanstack/react-query";
import { getCategories, getSubcategories } from "../api/dictionary";

export const dictionaryKeys = {
  categories: ["categories"] as const,
  subcategories: ["subcategories"] as const,
};

// Combines both dictionary queries for the contact form.
// staleTime: Infinity — the dictionary is effectively static, so never refetch it.
export function useDictionary() {
  const categories = useQuery({
    queryKey: dictionaryKeys.categories,
    queryFn: getCategories,
    staleTime: Infinity,
  });

  const subcategories = useQuery({
    queryKey: dictionaryKeys.subcategories,
    queryFn: getSubcategories,
    staleTime: Infinity,
  });

  return {
    categories: categories.data,
    subcategories: subcategories.data,
    isLoading: categories.isLoading || subcategories.isLoading,
    isError: categories.isError || subcategories.isError,
  };
}
