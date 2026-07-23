import { apiClient } from "./client";
import { API_PATHS } from "./paths";
import type { CategoryResponse, SubcategoryResponse } from "../types/category";

export function getCategories(): Promise<CategoryResponse[]> {
  return apiClient.get<CategoryResponse[]>(API_PATHS.dictionary.categories);
}

export function getSubcategories(): Promise<SubcategoryResponse[]> {
  return apiClient.get<SubcategoryResponse[]>(
    API_PATHS.dictionary.subcategories,
  );
}
