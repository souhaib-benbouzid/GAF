import { describe, expect, it } from "vitest";
import { type RawPost } from "../types/announcement";
import { capitalizeWords } from "./capitalize";
import { deriveAnnouncementCategory } from "./deriveAnnouncementCategory";
import { isAnnouncementUrgent } from "./isAnnouncementUrgent";
import { mapResponseToAnnouncement } from "./mapPostsToAnnouncements";

describe("Data Transformation Utilities", () => {
  describe("capitalizeWords", () => {
    it("should capitalize the first letter of every word", () => {
      expect(capitalizeWords("government announcement")).toBe(
        "Government Announcement",
      );
    });

    it("should handle and clean extra spaces or newline breaks", () => {
      expect(capitalizeWords("public \n health   update")).toBe(
        "Public Health Update",
      );
    });
  });

  describe("deriveAnnouncementCategory", () => {
    it('should assign "Health" when id % 4 === 0', () => {
      expect(deriveAnnouncementCategory(4)).toBe("Health");
      expect(deriveAnnouncementCategory(100)).toBe("Health");
    });

    it('should assign "Transport" when id % 4 === 1', () => {
      expect(deriveAnnouncementCategory(1)).toBe("Transport");
      expect(deriveAnnouncementCategory(5)).toBe("Transport");
    });

    it('should assign "Education" when id % 4 === 2', () => {
      expect(deriveAnnouncementCategory(2)).toBe("Education");
      expect(deriveAnnouncementCategory(6)).toBe("Education");
    });

    it('should assign "Infrastructure" when id % 4 is anything else', () => {
      expect(deriveAnnouncementCategory(3)).toBe("Infrastructure");
      expect(deriveAnnouncementCategory(7)).toBe("Infrastructure");
    });
  });

  describe("isAnnouncementUrgent", () => {
    it("should return true if id is divisible by 7", () => {
      expect(isAnnouncementUrgent(7)).toBe(true);
      expect(isAnnouncementUrgent(14)).toBe(true);
    });

    it("should return false if id is not divisible by 7", () => {
      expect(isAnnouncementUrgent(1)).toBe(false);
      expect(isAnnouncementUrgent(8)).toBe(false);
    });
  });

  describe("mapResponseToAnnouncement", () => {
    it("should correctly transform a RawPost into an Announcement schema", () => {
      const mockRawPost: RawPost = {
        userId: 1,
        id: 14, // 14 % 4 === 2 (Education), 14 % 7 === 0 (Urgent)
        title: "urgent school closure notice",
        body: "Details regarding school closures.",
      };

      const result = mapResponseToAnnouncement(mockRawPost);

      expect(result).toEqual({
        id: 14,
        title: "Urgent School Closure Notice",
        body: "Details regarding school closures.",
        category: "Education",
        isUrgent: true,
      });
    });
  });
});
