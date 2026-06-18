export const NavigationBar = () => {
  return (
    <header style={{ padding: "1rem", background: "#003366", color: "#fff" }}>
      <nav>
        <a href="/announcements" style={{ marginRight: "1rem", color: "#fff" }}>
          Announcements
        </a>
        <a href="/bookmarks" style={{ color: "#fff" }}>
          Bookmarks
        </a>
      </nav>
    </header>
  );
};
