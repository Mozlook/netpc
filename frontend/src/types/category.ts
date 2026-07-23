export interface CategoryResponse {
  id: number;
  name: string;
}

export interface SubcategoryResponse {
  id: number;
  categoryId: number;
  name: string;
}
