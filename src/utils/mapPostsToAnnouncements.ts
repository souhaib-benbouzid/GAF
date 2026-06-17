import { type Announcement, type RawPost } from "../types/announcement";
import { capitalizeWords } from "./capitalize";
import { deriveAnnouncementCategory } from "./deriveAnnouncementCategory";
import { isAnnouncementUrgent } from "./isAnnouncementUrgent";

export const mapResponseToAnnouncement = (post: RawPost): Announcement => {
  return {
    id: post.id,
    title: capitalizeWords(post.title),
    body: post.body,
    category: deriveAnnouncementCategory(post.id),
    isUrgent: isAnnouncementUrgent(post.id),
  };
};
