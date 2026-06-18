import React from "react";
import { Link, NavLink } from "react-router"; // Added Link
import { useAnnouncements } from "../../context/AnnouncementContext";
import styles from "./NavigationBar.module.css";

export const NavigationBar: React.FC = () => {
  const { bookmarkedIds } = useAnnouncements();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        GovPortal
      </Link>

      <div className={styles.navLinks}>
        <NavLink
          to="/announcements"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Announcements
        </NavLink>
        <NavLink
          to="/bookmarks"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Bookmarks
          {bookmarkedIds.size > 0 && (
            <span className={styles.badge}>{bookmarkedIds.size}</span>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default NavigationBar;
