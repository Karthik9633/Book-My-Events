import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { fetchFavoriteIds, toggleFavorite as apiToggle } from "../api/eventApi";

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // ✅ Reactive: reads token from state, not just once
  const token = localStorage.getItem("token");

  const loadFavoriteIds = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setFavoriteIds(new Set()); // ✅ clear favorites if not logged in
      return;
    }
    try {
      setLoading(true);
      const { data } = await fetchFavoriteIds();
      if (data.success) {
        setFavoriteIds(new Set(data.favoriteIds));
      }
    } catch (error) {
      console.log("Favorites load failed", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Re-run whenever token changes (login/logout)
  useEffect(() => {
    loadFavoriteIds();
  }, [loadFavoriteIds, token]);

  const isFavorite = (eventId) => favoriteIds.has(String(eventId));

  const toggleFavorite = async (eventId) => {
    if (!localStorage.getItem("token")) {
      throw new Error("Please log in to save favorites");
    }

    const id = typeof eventId === "object"
      ? String(eventId._id || eventId.id)
      : String(eventId);

    const wasFav = favoriteIds.has(id);

    // Optimistic update
    setFavoriteIds(prev => {
      const next = new Set(prev);
      wasFav ? next.delete(id) : next.add(id);
      return next;
    });

    try {
      const { data } = await apiToggle(id);
      setFavoriteIds(prev => {
        const next = new Set(prev);
        data.isFavorite ? next.add(id) : next.delete(id);
        return next;
      });
      return data;
    } catch (error) {
      // Rollback on failure
      setFavoriteIds(prev => {
        const next = new Set(prev);
        wasFav ? next.add(id) : next.delete(id);
        return next;
      });
      throw error;
    }
  };

  const removeFavorite = async (eventId) => {
    await toggleFavorite(eventId);
  };

  return (
    <FavoritesContext.Provider value={{
      favoriteIds, isFavorite, toggleFavorite,
      removeFavorite, loading, reload: loadFavoriteIds
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
};