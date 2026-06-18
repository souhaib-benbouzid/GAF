// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnnouncementContext } from "../context/AnnouncementContext";
import type { Announcement } from "../types/announcement";
import Bookmarks from "./bookmarks";

afterEach(() => {
  cleanup();
});

const sampleAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Transport Policy Update",
    body: "Commuter line transition logistics.",
    category: "Transport",
    isUrgent: false,
  },
  {
    id: 2,
    title: "Highway Repair Protocol",
    body: "Infrastructure funding distribution.",
    category: "Infrastructure",
    isUrgent: true,
  },
];

const renderBookmarksRoute = (contextValues = {}) => {
  const defaultContext = {
    announcements: sampleAnnouncements,
    bookmarkedIds: new Set<number>([1]),
    loading: false,
    error: null,
    fetchAnnouncements: vi.fn(),
    toggleBookmark: vi.fn(),
    getCachedAnnouncement: vi.fn(),
    ...contextValues,
  };

  return render(
    <AnnouncementContext.Provider value={defaultContext}>
      <BrowserRouter>
        <Bookmarks />
      </BrowserRouter>
    </AnnouncementContext.Provider>,
  );
};

describe("Bookmarks Page", () => {
  it("should show an empty placeholder view when there are no bookmarked items", () => {
    renderBookmarksRoute({ bookmarkedIds: new Set<number>() });
    expect(screen.getByText("No bookmarks found")).toBeTruthy();
  });

  it("should list only the items that have been bookmarked by the user", () => {
    renderBookmarksRoute();
    expect(screen.getByText("Transport Policy Update")).toBeTruthy();
    expect(screen.queryByText("Highway Repair Protocol")).toBeNull();
  });

  it("should correctly filter saved bookmarks using the search inputs", () => {
    renderBookmarksRoute({ bookmarkedIds: new Set<number>([1, 2]) });

    const searchInput = screen.getByPlaceholderText(
      "Search saved notices...",
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "Highway" } });

    expect(screen.getByText("Highway Repair Protocol")).toBeTruthy();
    expect(screen.queryByText("Transport Policy Update")).toBeNull();
  });
});
