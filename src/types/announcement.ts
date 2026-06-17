export interface RawPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type Category = "Health" | "Transport" | "Education" | "Infrastructure";

export interface Announcement {
  id: number;
  title: string;
  body: string;
  category: Category;
  isUrgent: boolean;
}
