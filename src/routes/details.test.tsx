// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnnouncementContext } from "../context/AnnouncementContext";
import type { Announcement } from "../types/announcement";
import AnnouncementDetail from "./details";

// Mock useParams to simulate routing to notice ID 2
const mockParams = { id: "2" };
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: () => mockParams,
  };
});

afterEach(() => {
  cleanup();
});

const sampleAnnouncement: Announcement = {
  id: 2,
  title: "Regional Highway Construction",
  body: "Infrastructure funding allocations announced.",
  category: "Infrastructure",
  isUrgent: true,
};

const renderDetailRoute = (contextValues = {}) => {
  const defaultContext = {
    announcements: [sampleAnnouncement],
    bookmarkedIds: new Set<number>(),
    loading: false,
    error: null,
    fetchAnnouncements: vi.fn(),
    toggleBookmark: vi.fn(),
    getCachedAnnouncement: (id: number) =>
      id === 2 ? sampleAnnouncement : undefined,
    ...contextValues,
  };

  return render(
    <AnnouncementContext.Provider value={defaultContext}>
      <BrowserRouter>
        <AnnouncementDetail />
      </BrowserRouter>
    </AnnouncementContext.Provider>,
  );
};

describe("Announcement Detail Page", () => {
  it("should display details when the notice is found in the cache", () => {
    renderDetailRoute();

    expect(screen.getByText("Regional Highway Construction")).toBeTruthy();
    expect(
      screen.getByText("Infrastructure funding allocations announced."),
    ).toBeTruthy();
    expect(screen.getByText("⚠️ Urgent Notice")).toBeTruthy();
  });

  it("should let users toggle bookmarks directly from the detail panel", () => {
    const mockToggle = vi.fn();
    renderDetailRoute({ toggleBookmark: mockToggle });

    const saveBtn = screen.getByRole("button", { name: /Save to Bookmarks/i });
    fireEvent.click(saveBtn);

    expect(mockToggle).toHaveBeenCalledWith(2);
  });

  it("should show an empty placeholder state if the notice does not exist", () => {
    renderDetailRoute({ getCachedAnnouncement: () => undefined });

    expect(screen.getByText("Bulletin Not Found")).toBeTruthy();
    expect(
      screen.getByText(
        /The announcement you are trying to view does not exist/i,
      ),
    ).toBeTruthy();
  });
});
