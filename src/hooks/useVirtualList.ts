import { useMemo, useState } from "react";

interface UseVirtualListParams {
  itemCount: number;
  itemHeight: number;
  viewportHeight: number;
  buffer?: number;
}

export const useVirtualList = ({
  itemCount,
  itemHeight,
  viewportHeight,
  buffer = 2,
}: UseVirtualListParams) => {
  const [scrollTop, setScrollTop] = useState(0);
  const totalHeight = itemCount * itemHeight;
  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight) - buffer;
    const end = Math.ceil((scrollTop + viewportHeight) / itemHeight) + buffer;

    return {
      startIndex: Math.max(0, start),
      endIndex: Math.min(itemCount - 1, end),
    };
  }, [scrollTop, itemCount, itemHeight, viewportHeight, buffer]);

  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        offsetTop: i * itemHeight,
      });
    }
    return items;
  }, [startIndex, endIndex, itemHeight]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    scrollTop,
    setScrollTop,
  };
};
