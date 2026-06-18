import AnnouncementCard from "../AnnouncementCard/AnnouncementCard";
import type { AnnouncementListProps } from "./AnnouncementList.type";

export const AnnouncementList = ({
  announcement,
  bookmarkedIds,
  toggleBookmark,
  searchParams,
  styles,
}: AnnouncementListProps) => {
  return (
    <>
      {announcement.length === 0 ? (
        <div className={styles.centerState}>
          <p>No announcements found.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {announcement.map((item) => (
            <AnnouncementCard
              key={item.id}
              announcement={item}
              isBookmarked={bookmarkedIds.has(item.id)}
              onToggleBookmark={() => toggleBookmark(item.id)}
              preserveSearchParams={`?${searchParams.toString()}`}
            />
          ))}
        </div>
      )}
    </>
  );
};
