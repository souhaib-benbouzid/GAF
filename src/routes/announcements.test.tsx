// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnnouncementContext } from "../context/AnnouncementContext";
import type { Announcement } from "../types/announcement";
import Announcements from "./announcements";

afterEach(() => {
  cleanup();
});

const sampleAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Transport System Adjustments",
    body: "New commuter transit rules applied.",
    category: "Transport",
    isUrgent: false,
  },
  {
    id: 2,
    title: "Regional Highway Construction",
    body: "Infrastructure funding allocations announced.",
    category: "Infrastructure",
    isUrgent: true,
  },
  {
    id: 3,
    title: "Emergency Clinic Protocols",
    body: "Health facility screening details.",
    category: "Health",
    isUrgent: false,
  },
];

const renderAnnouncementsRoute = (contextValues = {}) => {
  const defaultContext = {
    announcements: sampleAnnouncements,
    bookmarkedIds: new Set<number>(),
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
        <Announcements />
      </BrowserRouter>
    </AnnouncementContext.Provider>,
  );
};

describe("Announcements Page", () => {
  it("should show a loading spinner when fetching data", () => {
    renderAnnouncementsRoute({ loading: true, announcements: [] });
    expect(
      screen.getByText(/Loading announcement database matrices\.\.\./i),
    ).toBeTruthy();
  });

  it("should show an error message and a retry button on failure", () => {
    const mockRetry = vi.fn();

    renderAnnouncementsRoute({
      error: "Network connection dropped unexpectedly.",
      announcements: [],
      fetchAnnouncements: mockRetry,
    });

    expect(screen.getByText("System Communication Error")).toBeTruthy();
    expect(
      screen.getByText("Network connection dropped unexpectedly."),
    ).toBeTruthy();

    const retryBtn = screen.getByRole("button", {
      name: /Retry/i,
    });
    fireEvent.click(retryBtn);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it("should display the filter search bar and initial list of announcements", () => {
    renderAnnouncementsRoute();

    expect(
      screen.getByPlaceholderText("Filter notices by keywords or details..."),
    ).toBeTruthy();
    expect(screen.getByText("Transport System Adjustments")).toBeTruthy();
    expect(screen.getByText("Regional Highway Construction")).toBeTruthy();
  });

  it("should filter announcements by text search input", () => {
    renderAnnouncementsRoute();

    const searchInput = screen.getByPlaceholderText(
      "Filter notices by keywords or details...",
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "Highway" } });

    expect(screen.getByText("Regional Highway Construction")).toBeTruthy();
    expect(screen.queryByText("Transport System Adjustments")).toBeNull();
    expect(screen.queryByText("Emergency Clinic Protocols")).toBeNull();
  });

  it("should filter announcements by selected category dropdown option", () => {
    renderAnnouncementsRoute();

    const searchInput = screen.getByPlaceholderText(
      "Filter notices by keywords or details...",
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "" } });

    const selectDropdown = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(selectDropdown, { target: { value: "Health" } });

    expect(screen.getByText("Emergency Clinic Protocols")).toBeTruthy();
    expect(screen.queryByText("Transport System Adjustments")).toBeNull();
    expect(screen.queryByText("Regional Highway Construction")).toBeNull();
  });

  it("should show an empty state message when no search results match", () => {
    renderAnnouncementsRoute();

    const searchInput = screen.getByPlaceholderText(
      "Filter notices by keywords or details...",
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "xyz123abc" } });

    expect(screen.getByText(/No announcements found\./i)).toBeTruthy();
  });
});
