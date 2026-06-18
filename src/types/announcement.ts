export interface RawPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type Category = "Health" | "Transport" | "Education" | "Infrastructure";
export type CategoryFilter = Category | "All";
export const FILTER_CATEGORIES: CategoryFilter[] = [
  "All",
  "Health",
  "Transport",
  "Education",
  "Infrastructure",
];

export interface Announcement {
  id: number;
  title: string;
  body: string;
  category: Category;
  isUrgent: boolean;
}
