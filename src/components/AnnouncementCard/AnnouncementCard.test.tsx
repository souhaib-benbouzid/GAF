// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnnouncementContext } from "../../context/AnnouncementContext";
import type { Announcement } from "../../types/announcement";
import AnnouncementCard from "./AnnouncementCard";

afterEach(() => {
  cleanup();
});

const mockContextDefaults = {
  announcements: [],
  bookmarkedIds: new Set<number>(),
  loading: false,
  error: null,
  fetchAnnouncements: vi.fn(),
  toggleBookmark: vi.fn(),
  getCachedAnnouncement: vi.fn(),
};

const sampleAnnouncement: Announcement = {
  id: 42,
  title: "Infrastructure Upgrades Launched",
  body: "A comprehensive national infrastructure overhaul campaign kicks off across all regional sectors.",
  category: "Infrastructure",
  isUrgent: true,
};

const renderWithProviders = (ui: React.ReactElement, contextOverrides = {}) => {
  const mergedContext = { ...mockContextDefaults, ...contextOverrides };
  return render(
    <AnnouncementContext.Provider value={mergedContext}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AnnouncementContext.Provider>,
  );
};

describe("AnnouncementCard Component", () => {
  it("correctly maps and renders structural layout text values", () => {
    renderWithProviders(
      <AnnouncementCard
        announcement={sampleAnnouncement}
        isBookmarked={false}
        onToggleBookmark={vi.fn()}
      />,
    );

    expect(screen.getByText(sampleAnnouncement.title)).toBeTruthy();
    expect(screen.getByText(sampleAnnouncement.category)).toBeTruthy();
    expect(screen.getByText(/⚠️ Urgent/i)).toBeTruthy();
  });

  it("displays unbookmarked state indicator text by default", () => {
    renderWithProviders(
      <AnnouncementCard
        announcement={sampleAnnouncement}
        isBookmarked={false}
        onToggleBookmark={vi.fn()}
      />,
    );

    const button = screen.getByRole("button");
    expect(button.textContent).toContain("☆ Bookmark");
    expect(button.className).not.toMatch(/bookmarked/);
  });

  it("applies stylistic highlights when bookmark status parameter evaluates to true", () => {
    renderWithProviders(
      <AnnouncementCard
        announcement={sampleAnnouncement}
        isBookmarked={true}
        onToggleBookmark={vi.fn()}
      />,
    );

    const button = screen.getByRole("button");
    expect(button.textContent).toContain("★ Bookmarked");

    expect(button.className).toMatch(/bookmarked/);
  });

  it("intercepts click triggers and fires the associated callback routine cleanly", () => {
    const mockToggleSpy = vi.fn();

    renderWithProviders(
      <AnnouncementCard
        announcement={sampleAnnouncement}
        isBookmarked={false}
        onToggleBookmark={mockToggleSpy}
      />,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockToggleSpy).toHaveBeenCalledTimes(1);
  });

  it("attaches preserved search parameter contexts onto detail navigation targets", () => {
    const mockSearchContext = "?search=tax&category=Infrastructure";

    renderWithProviders(
      <AnnouncementCard
        announcement={sampleAnnouncement}
        isBookmarked={false}
        onToggleBookmark={vi.fn()}
        preserveSearchParams={mockSearchContext}
      />,
    );

    const detailsLink = screen.getByRole("link", { name: /view details/i });

    expect(detailsLink.getAttribute("href")).toBe(
      `/announcements/42${mockSearchContext}`,
    );
  });
});
