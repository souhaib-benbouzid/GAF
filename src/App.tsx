import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { NavigationBar } from "./components/NavigationBar/NavigationBar";
import { AnnouncementProvider } from "./context/AnnouncementProvider";
import AnnouncementsPage from "./routes/announcements";
import BookmarksPage from "./routes/bookmarks";
import DetailsPageRoute from "./routes/details";

export default function Root() {
  return (
    <AnnouncementProvider>
      <BrowserRouter>
        <NavigationBar />
        <main>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/announcements" replace />}
            />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/announcements/:id" element={<DetailsPageRoute />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route
              path="*"
              element={<Navigate to="/announcements" replace />}
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AnnouncementProvider>
  );
}
