import { createContext, useContext } from "react";
import { type Announcement } from "../types/announcement";

export interface AnnouncementContextType {
  announcements: Announcement[];
  bookmarkedIds: Set<number>;
  loading: boolean;
  error: string | null;
  fetchAnnouncements: () => Promise<void>;
  toggleBookmark: (id: number) => void;
  getCachedAnnouncement: (id: number) => Announcement | undefined;
}

export const AnnouncementContext = createContext<
  AnnouncementContextType | undefined
>(undefined);

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error(
      "useAnnouncements must be implemented inside an AnnouncementProvider container.",
    );
  }
  return context;
};
