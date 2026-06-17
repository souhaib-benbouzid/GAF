import React, { useCallback, useEffect, useState } from "react";
import { type Announcement, type RawPost } from "../types/announcement";
import { mapResponseToAnnouncement } from "../utils/mapPostsToAnnouncements";
import { AnnouncementContext } from "./AnnouncementContext";

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem("gov_announcements_bookmarks");
      return saved ? new Set<number>(JSON.parse(saved)) : new Set<number>();
    } catch {
      return new Set<number>();
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "gov_announcements_bookmarks",
      JSON.stringify(Array.from(bookmarkedIds)),
    );
  }, [bookmarkedIds]);

  const fetchAnnouncements = useCallback(async () => {
    if (announcements.length > 0) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
      );
      if (!response.ok) {
        throw new Error("Failed to retrieve announcements feed.");
      }
      const data: RawPost[] = await response.json();
      setAnnouncements(data.map(mapResponseToAnnouncement));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected networking failure occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [announcements.length]);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarkedIds((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(id)) {
        nextSet.delete(id);
      } else {
        nextSet.add(id);
      }
      return nextSet;
    });
  }, []);

  const getCachedAnnouncement = useCallback(
    (id: number) => announcements.find((a) => a.id === id),
    [announcements],
  );

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        bookmarkedIds,
        loading,
        error,
        fetchAnnouncements,
        toggleBookmark,
        getCachedAnnouncement,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};
