export const isAnnouncementUrgent = (id: number): boolean => {
  return id % 7 === 0;
};
