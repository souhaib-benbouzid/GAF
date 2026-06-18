import React from "react";
import { Link } from "react-router";
import type { Announcement } from "../../types/announcement";
import styles from "./AnnouncementCard.module.css";

interface AnnouncementCardProps {
  announcement: Announcement;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  preserveSearchParams?: string;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  isBookmarked,
  onToggleBookmark,
  preserveSearchParams,
}) => {
  const categoryKey =
    announcement.category.toLowerCase() as keyof typeof styles;
  const categoryClass = styles[categoryKey] || "";

  return (
    <div
      className={`${styles.card} ${announcement.isUrgent ? styles.urgentCard : ""}`}
    >
      <div className={styles.header}>
        <span className={`${styles.badge} ${categoryClass}`}>
          {announcement.category}
        </span>
        {announcement.isUrgent && (
          <span className={styles.urgentTag}>⚠️ Urgent</span>
        )}
      </div>

      <h3 className={styles.title}>{announcement.title}</h3>
      <p className={styles.body}>{announcement.body.substring(0, 120)}...</p>

      <div className={styles.footer}>
        <Link
          to={`/announcements/${announcement.id}${preserveSearchParams || ""}`}
          className={styles.readMore}
        >
          View Details
        </Link>
        <button
          type="button"
          onClick={onToggleBookmark}
          className={`${styles.bookmarkBtn} ${isBookmarked ? styles.bookmarked : ""}`}
        >
          {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
        </button>
      </div>
    </div>
  );
};

export default AnnouncementCard;
