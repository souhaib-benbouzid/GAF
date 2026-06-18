import { useEffect } from "react";
import { useAnnouncements } from "../context/AnnouncementContext";

export const useFetchAnnouncements = () => {
  const { fetchAnnouncements } = useAnnouncements();

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);
};
