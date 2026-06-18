import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useVirtualList } from "./useVirtualList";

const makeEvent = (scrollTop: number) =>
  ({ currentTarget: { scrollTop } }) as React.UIEvent<HTMLDivElement>;

const defaultParams = {
  itemCount: 100,
  itemHeight: 50,
  viewportHeight: 200,
  buffer: 2,
};

describe("useVirtualList", () => {
  describe("total height", () => {
    it("is itemCount multiplied by itemHeight", () => {
      const { result } = renderHook(() =>
        useVirtualList({ itemCount: 100, itemHeight: 50, viewportHeight: 200 }),
      );
      expect(result.current.totalHeight).toBe(5000);
    });

    it("is zero when there are no items", () => {
      const { result } = renderHook(() =>
        useVirtualList({ itemCount: 0, itemHeight: 50, viewportHeight: 200 }),
      );
      expect(result.current.totalHeight).toBe(0);
    });
  });

  describe("visible items at rest", () => {
    it("always starts at index 0", () => {
      const { result } = renderHook(() => useVirtualList(defaultParams));
      expect(result.current.visibleItems[0].index).toBe(0);
    });

    it("renders extra rows above and below the viewport as a buffer", () => {
      const { result } = renderHook(() => useVirtualList(defaultParams));
      const indices = result.current.visibleItems.map((i) => i.index);
      expect(indices).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });

    it("never goes past the last item when the list is short", () => {
      const { result } = renderHook(() =>
        useVirtualList({ itemCount: 3, itemHeight: 50, viewportHeight: 200 }),
      );
      const indices = result.current.visibleItems.map((i) => i.index);
      expect(indices).toEqual([0, 1, 2]);
    });

    it("returns nothing when there are no items", () => {
      const { result } = renderHook(() =>
        useVirtualList({ itemCount: 0, itemHeight: 50, viewportHeight: 200 }),
      );
      expect(result.current.visibleItems).toEqual([]);
    });
  });

  describe("item position", () => {
    it("places each item at its index multiplied by the row height", () => {
      const { result } = renderHook(() => useVirtualList(defaultParams));
      result.current.visibleItems.forEach(({ index, offsetTop }) => {
        expect(offsetTop).toBe(index * defaultParams.itemHeight);
      });
    });
  });

  describe("scrolling", () => {
    it("shifts the visible window when the user scrolls down", () => {
      const { result } = renderHook(() => useVirtualList(defaultParams));

      act(() => {
        result.current.handleScroll(makeEvent(300));
      });

      expect(result.current.scrollTop).toBe(300);
      const indices = result.current.visibleItems.map((i) => i.index);
      expect(indices[0]).toBe(4);
      expect(indices[indices.length - 1]).toBe(12);
    });

    it("keeps startIndex at 0 when scrolled near the top", () => {
      const { result } = renderHook(() => useVirtualList(defaultParams));

      act(() => {
        result.current.handleScroll(makeEvent(50));
      });

      expect(result.current.visibleItems[0].index).toBe(0);
    });

    it("keeps endIndex within bounds when the list is short", () => {
      const { result } = renderHook(() =>
        useVirtualList({ itemCount: 5, itemHeight: 50, viewportHeight: 200 }),
      );

      act(() => {
        result.current.handleScroll(makeEvent(0));
      });

      const indices = result.current.visibleItems.map((i) => i.index);
      expect(indices[indices.length - 1]).toBe(4);
    });

    it("tracks the current scroll position", () => {
      const { result } = renderHook(() => useVirtualList(defaultParams));

      act(() => {
        result.current.handleScroll(makeEvent(150));
      });

      expect(result.current.scrollTop).toBe(150);
    });
  });

  describe("setScrollTop", () => {
    it("jumps to any position directly", () => {
      const { result } = renderHook(() => useVirtualList(defaultParams));

      act(() => {
        result.current.setScrollTop(400);
      });

      expect(result.current.scrollTop).toBe(400);
    });

    it("resets the visible window back to the top", () => {
      const { result } = renderHook(() => useVirtualList(defaultParams));

      act(() => {
        result.current.handleScroll(makeEvent(500));
      });
      act(() => {
        result.current.setScrollTop(0);
      });

      expect(result.current.visibleItems[0].index).toBe(0);
    });
  });

  describe("buffer", () => {
    it("defaults to 2 when not provided", () => {
      const withBuffer = renderHook(() =>
        useVirtualList({ ...defaultParams, buffer: 2 }),
      );
      const withoutBuffer = renderHook(() =>
        useVirtualList({
          itemCount: defaultParams.itemCount,
          itemHeight: defaultParams.itemHeight,
          viewportHeight: defaultParams.viewportHeight,
        }),
      );

      expect(withBuffer.result.current.visibleItems).toEqual(
        withoutBuffer.result.current.visibleItems,
      );
    });

    it("renders more rows when the buffer is larger", () => {
      const small = renderHook(() =>
        useVirtualList({ ...defaultParams, buffer: 1 }),
      );
      const large = renderHook(() =>
        useVirtualList({ ...defaultParams, buffer: 5 }),
      );

      expect(large.result.current.visibleItems.length).toBeGreaterThan(
        small.result.current.visibleItems.length,
      );
    });

    it("renders only what fits in the viewport when buffer is 0", () => {
      const { result } = renderHook(() =>
        useVirtualList({ ...defaultParams, buffer: 0 }),
      );
      expect(result.current.visibleItems.length).toBe(5);
    });
  });

  describe("reacting to prop changes", () => {
    it("shows more items when the viewport gets taller", () => {
      const { result, rerender } = renderHook(
        (props) => useVirtualList(props),
        { initialProps: { ...defaultParams, viewportHeight: 200 } },
      );
      const initialCount = result.current.visibleItems.length;

      rerender({ ...defaultParams, viewportHeight: 400 });

      expect(result.current.visibleItems.length).toBeGreaterThan(initialCount);
    });

    it("trims the visible range when itemCount drops below the current window", () => {
      const { result, rerender } = renderHook(
        (props) => useVirtualList(props),
        { initialProps: { ...defaultParams, itemCount: 100 } },
      );

      rerender({ ...defaultParams, itemCount: 3 });

      const indices = result.current.visibleItems.map((i) => i.index);
      expect(Math.max(...indices)).toBe(2);
    });
  });
});
