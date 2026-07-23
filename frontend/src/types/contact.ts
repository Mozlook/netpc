// Mirrors backend contact DTOs. JSON is camelCase; DateTime arrives as an ISO string.
export interface ContactListItemResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  category: string;
}

// Responses expose category/subcategory as names; the request DTOs below take ids.
export interface ContactDetailsResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  category: string;
  subcategory: string | null;
  customSubcategory: string | null;
  phone: string;
  dateOfBirth: string;
  ownerId: number;
}

export interface ContactCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  categoryId: number;
  subcategoryId: number | null;
  customSubcategory: string | null;
}

export interface ContactUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  // Optional: omit / null keeps the current password.
  password?: string | null;
  phone: string;
  dateOfBirth: string;
  categoryId: number;
  subcategoryId: number | null;
  customSubcategory: string | null;
}
