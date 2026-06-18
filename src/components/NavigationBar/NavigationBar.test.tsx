// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnnouncementContext } from "../../context/AnnouncementContext";
import NavigationBar from "./NavigationBar";

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

const renderWithProviders = (ui: React.ReactElement, contextOverrides = {}) => {
  const mergedContext = { ...mockContextDefaults, ...contextOverrides };
  return render(
    <AnnouncementContext.Provider value={mergedContext}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AnnouncementContext.Provider>,
  );
};

describe("NavigationBar Component", () => {
  it("renders branding title and routing navigation hyperlinks correctly", () => {
    renderWithProviders(<NavigationBar />);

    expect(screen.getByText("GovPortal")).toBeTruthy();
    expect(screen.getByRole("link", { name: /announcements/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /bookmarks/i })).toBeTruthy();
  });

  it("hides the numeric counter badge if the bookmarks Set is empty", () => {
    renderWithProviders(<NavigationBar />, { bookmarkedIds: new Set() });

    const badge = screen.queryByText(/[0-9]/);
    expect(badge).not.toBeTruthy();
  });

  it("displays the exact item count badge when bookmarks exist inside state collections", () => {
    const mockActiveBookmarks = new Set([10, 25, 42]);
    renderWithProviders(<NavigationBar />, {
      bookmarkedIds: mockActiveBookmarks,
    });

    const badge = screen.getByText("3");
    expect(badge).toBeTruthy();
    expect(badge.className).toMatch(/badge/);
  });

  it("ensures the branding logo link routes to the root path without trailing parameters", () => {
    renderWithProviders(<NavigationBar />);

    const logoLink = screen.getByText("GovPortal").closest("a");
    expect(logoLink?.getAttribute("href")).toBe("/");
  });

  it("safely handles extremely large badge counts without breaking layout structures", () => {
    const massiveBookmarks = new Set(Array.from({ length: 9999 }, (_, i) => i));
    renderWithProviders(<NavigationBar />, { bookmarkedIds: massiveBookmarks });

    const badge = screen.getByText("9999");
    expect(badge).toBeTruthy();
  });
});
