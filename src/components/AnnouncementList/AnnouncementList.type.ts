import type { Announcement } from "../../types/announcement";

export interface AnnouncementListProps {
  announcement: Announcement[];
  bookmarkedIds: Set<number>;
  toggleBookmark: (id: number) => void;
  searchParams: URLSearchParams;
  styles: Record<string, string>;
}
