# Architecture Overview

## Centralized State Context

The application is structured around a global state context to manage the announcements data and user interactions such as bookmarking. This approach allows for efficient state management and ensures that components can access and update the state without prop drilling. The AnnouncementContext provides a centralized store for the announcements and bookmarked IDs, along with functions to fetch data and toggle bookmarks. This design promotes separation of concerns and makes it easier to maintain and scale the application in the future.

## Persistent Bookmarks

LocalStorage is used to persist the bookmarked IDs across sessions, ensuring that users do not lose their saved announcements when they refresh the page or close the browser.

## Smart Cache Layer

Announcements are fetched from a mock API and stored in the context state. The application checks if the announcements have already been loaded to avoid unnecessary network requests, improving performance and user experience.

## Production Considerations

Because JSON data from the mock API is static and does not change, the application does not implement real-time updates or polling. However, for a production application, a batched retrieval request (e.g., GET /announcements?ids=...) should be implemented to validate bookmark existence and fetch fresh content on application boot.

## State Architecture & Complexity Analysis

To evaluate whether an individual announcement card displays an active bookmark state (filled vs empty star), the component must read the saved selections state.This application migrates index states into a native JavaScript Set object structure. Checking for properties via Set.prototype.has() executes via internal hash tables with complexity of O(1). This reduces overall feed rendering costs down to a highly scalable O(N) where N is the number of announcements in the feed. This optimization is crucial for maintaining performance as the number of announcements grows, ensuring that the application remains responsive and efficient even with a large dataset.

## The React Immutability Trade-Off

Because React’s reconciliation engine determines component updates through shadow-comparison of state object memory references, directly mutating a Set (e.g., set.add(id)) will fail to trigger a screen re-render. To ensure the UI updates reliably, the toggle action instantiates a shallow copy

```ts
const nextSet = new Set(prevSet);
```

## Infinite Scroll & Pagination Limitations

Due to the lack of time to implement custom virtualized lists or pagination, the application currently loads and renders all announcements at once. This design choice leads to significant performance issues as the dataset grows, resulting in slow load times, high memory usage, and a poor user experience.
