import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualList } from "../../hooks/useVirtualList";
import type { Announcement } from "../../types/announcement";
import AnnouncementCard from "../AnnouncementCard/AnnouncementCard";
import type { AnnouncementListProps } from "./AnnouncementList.type";

export const AnnouncementList = ({
  announcement,
  bookmarkedIds,
  toggleBookmark,
  searchParams,
  styles,
}: AnnouncementListProps) => {
  const ITEMS_PER_ROW = 3;
  const ROW_HEIGHT = 400;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight - 365 : 500,
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight - 365);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chunkedRows = useMemo(() => {
    const rows: Announcement[][] = [];
    for (let i = 0; i < announcement.length; i += ITEMS_PER_ROW) {
      rows.push(announcement.slice(i, i + ITEMS_PER_ROW));
    }

    return rows;
  }, [announcement]);

  const { visibleItems, totalHeight, handleScroll, setScrollTop } =
    useVirtualList({
      itemCount: chunkedRows.length,
      itemHeight: ROW_HEIGHT,
      viewportHeight: viewportHeight,
      buffer: 2,
    });

  const preserveSearchParams = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  useEffect(() => {
    if (searchParams) {
      setScrollTop(0);
      if (viewportRef.current) {
        viewportRef.current.scrollTop = 0;
      }
    }
  }, [searchParams, setScrollTop]);
  return (
    <>
      {announcement.length === 0 ? (
        <div className={styles.centerState}>
          <p>No announcements found.</p>
        </div>
      ) : (
        <div
          className={styles.viewportWindow}
          ref={viewportRef}
          onScroll={handleScroll}
          style={{
            height: `${viewportHeight}px`,
            overflowY: "auto",
            position: "relative",
          }}
          data-testid="scroll-viewport"
        >
          <div
            className={styles.canvasStretch}
            style={{
              height: `${totalHeight}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {visibleItems.map(({ index, offsetTop }) => {
              const rowItems = chunkedRows[index];
              return (
                <div
                  key={index}
                  className={styles.virtualGridRow}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${ROW_HEIGHT}px`,
                    transform: `translateY(${offsetTop}px)`,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                  }}
                >
                  {rowItems.map((item) => (
                    <div key={item.id} className={styles.gridCell}>
                      <AnnouncementCard
                        announcement={item}
                        isBookmarked={bookmarkedIds.has(item.id)}
                        onToggleBookmark={() => toggleBookmark(item.id)}
                        preserveSearchParams={preserveSearchParams}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
