import React from "react";
import { Link, useParams, useSearchParams } from "react-router";
import cardStyles from "../components/AnnouncementCard/AnnouncementCard.module.css";
import { useAnnouncements } from "../context/AnnouncementContext";
import listStyles from "./announcements.module.css";

export const AnnouncementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { getCachedAnnouncement, toggleBookmark, bookmarkedIds } =
    useAnnouncements();

  const announcementId = id ? parseInt(id, 10) : NaN;
  const announcement = getCachedAnnouncement(announcementId);

  const preserveSearchParams = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  if (!announcement) {
    return (
      <div className={listStyles.container}>
        <div className={listStyles.centerState}>
          <h3>Bulletin Not Found</h3>
          <p>
            The announcement you are trying to view does not exist or has been
            archived.
          </p>
          <Link
            to={`/announcements${preserveSearchParams}`}
            className={cardStyles.readMore}
          >
            ← Back to Announcements
          </Link>
        </div>
      </div>
    );
  }

  const isBookmarked = bookmarkedIds.has(announcement.id);
  const catClass = announcement.category.toLowerCase();

  return (
    <div className={listStyles.container}>
      <div className={listStyles.backButtonWrapper}>
        <Link
          to={`/announcements${preserveSearchParams}`}
          className={cardStyles.readMore}
        >
          ← Back to Announcements
        </Link>
      </div>

      <article
        className={`${cardStyles.card} ${announcement.isUrgent ? cardStyles.urgentCard : ""} ${listStyles.detailCardOverride}`}
      >
        <div className={cardStyles.header}>
          <span className={`${cardStyles.badge} ${cardStyles[catClass] || ""}`}>
            {announcement.category}
          </span>
          {announcement.isUrgent && (
            <span className={cardStyles.urgentTag}>⚠️ Urgent Notice</span>
          )}
        </div>

        <h1 className={listStyles.title}>{announcement.title}</h1>

        <p className={`${cardStyles.body} ${listStyles.detailBody}`}>
          {announcement.body}
        </p>

        <div className={cardStyles.footer}>
          <span>Official Document Ref: #{announcement.id}</span>
          <button
            type="button"
            onClick={() => toggleBookmark(announcement.id)}
            className={`${cardStyles.bookmarkBtn} ${isBookmarked ? cardStyles.bookmarked : ""}`}
          >
            {isBookmarked ? "★ Saved to Bookmarks" : "☆ Save to Bookmarks"}
          </button>
        </div>
      </article>
    </div>
  );
};

export default AnnouncementDetail;
