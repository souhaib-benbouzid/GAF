import React from "react";
import { useSearchParams } from "react-router";
import { AnnouncementList } from "../components/AnnouncementList/AnnouncementList";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { useAnnouncements } from "../context/AnnouncementContext";
import { useFetchAnnouncements } from "../hooks/useFetchAnnouncements";
import listStyles from "./announcements.module.css";

export const Bookmarks: React.FC = () => {
  const { announcements, bookmarkedIds, toggleBookmark, loading } =
    useAnnouncements();
  useFetchAnnouncements();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";
  const bookmarkedList = announcements.filter((item) =>
    bookmarkedIds.has(item.id),
  );

  const filteredBookmarks = bookmarkedList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryQuery === "" || item.category === categoryQuery;
    return matchesSearch && matchesCategory;
  });

  const existingCategories = Array.from(
    new Set(["All", ...bookmarkedList.map((item) => item.category)]),
  );

  const handleSearchChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set("search", value);
    } else {
      nextParams.delete("search");
    }
    setSearchParams(nextParams);
  };

  const handleCategoryChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value && value !== "All") {
      nextParams.set("category", value);
    } else {
      nextParams.delete("category");
    }
    setSearchParams(nextParams);
  };

  if (loading) {
    return (
      <div className={listStyles.container}>
        <div className={listStyles.centerState}>
          <p>Loading your bookmarked circulars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={listStyles.container}>
      <header className={listStyles.headerSection}>
        <h1 className={listStyles.title}>Saved Bulletins</h1>
        <p className={listStyles.subtitle}>
          Review historical records and bookmarked urgent circulars.
        </p>
      </header>

      {bookmarkedList.length > 0 && (
        <>
          <FilterBar
            searchQuery={searchQuery}
            selectedCategory={categoryQuery}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            categories={existingCategories}
          />
          <AnnouncementList
            announcement={filteredBookmarks}
            bookmarkedIds={bookmarkedIds}
            toggleBookmark={toggleBookmark}
            searchParams={searchParams}
            styles={listStyles}
          />
        </>
      )}

      {bookmarkedList.length === 0 && (
        <div className={listStyles.centerState}>
          <h3>No bookmarks found</h3>
          <p>
            When viewing circulars, click "Bookmark" to preserve critical
            announcements here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
