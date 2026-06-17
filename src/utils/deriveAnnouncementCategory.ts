import { type Category } from "../types/announcement";

export const deriveAnnouncementCategory = (id: number): Category => {
  const remainder = id % 4;
  if (remainder === 0) return "Health";
  if (remainder === 1) return "Transport";
  if (remainder === 2) return "Education";
  return "Infrastructure";
};
