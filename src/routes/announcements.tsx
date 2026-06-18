import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";
import AnnouncementCard from "../components/AnnouncementCard/AnnouncementCard";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { useAnnouncements } from "../context/AnnouncementContext";
import { FILTER_CATEGORIES, type CategoryFilter } from "../types/announcement";
import styles from "./announcements.module.css";

export default function AnnouncementsPage() {
  const {
    announcements,
    bookmarkedIds,
    loading,
    error,
    fetchAnnouncements,
    toggleBookmark,
  } = useAnnouncements();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const selectedCategory =
    (searchParams.get("category") as CategoryFilter) || "All";

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchParams((prev) => {
        if (!value) prev.delete("search");
        else prev.set("search", value);
        return prev;
      });
    },
    [setSearchParams],
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      setSearchParams((prev) => {
        if (value === "All") prev.delete("category");
        else prev.set("category", value);
        return prev;
      });
    },
    [setSearchParams],
  );

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className={styles.centerState}>
        <p>Loading announcement database matrices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.centerState} ${styles.errorState}`}>
        <h3>System Communication Error</h3>
        <p>{error}</p>
        <button
          type="button"
          className={styles.retryBtn}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div>
        <h2>Announcements Feed</h2>
        <p className={styles.subtitle}>
          Access official notices and government circular updates.
        </p>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        categories={FILTER_CATEGORIES}
      />

      {filteredAnnouncements.length === 0 ? (
        <div className={styles.centerState}>
          <p>No active alerts or public matches.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredAnnouncements.map((item) => (
            <AnnouncementCard
              key={item.id}
              announcement={item}
              isBookmarked={bookmarkedIds.has(item.id)}
              onToggleBookmark={() => toggleBookmark(item.id)}
              preserveSearchParams={`?${searchParams.toString()}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
