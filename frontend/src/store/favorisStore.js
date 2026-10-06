import { create } from 'zustand'
import {
    getFavorites,
    addFavoriteToApi,
    removeFavoriteFromApi
} from '../services/favoriteService'

const useFavoritesStore = create((set, get) => ({
    favorites: [],
    loading: false,
    error: null,

    fetchFavorites: async (token) => {
        try {
            set({
                loading: true,
                error: null
            })

            const favorites = await getFavorites(token)

            set({
                favorites,
                loading: false
            })
        } catch (error) {
            console.error(error)

            set({
                loading: false,
                error: error.message
            })
        }
    },

    addFavorite: async (idAttraction, token) => {
        try {
            await addFavoriteToApi(idAttraction, token)

            await get().fetchFavorites(token)
        } catch (error) {
            console.error(error)

            set({
                error: error.message
            })
        }
    },

    removeFavorite: async (idAttraction, token) => {
        try {
            await removeFavoriteFromApi(idAttraction, token)

            set((state) => ({
                favorites: state.favorites.filter(
                    (favorite) =>
                        Number(favorite.id_attraction) !== Number(idAttraction)
                )
            }))
        } catch (error) {
            console.error(error)

            set({
                error: error.message
            })
        }
    },

    toggleFavorite: async (idAttraction, token) => {
        const isFavorite = get().isFavorite(idAttraction)

        if (isFavorite) {
            await get().removeFavorite(idAttraction, token)
        } else {
            await get().addFavorite(idAttraction, token)
        }
    },

    isFavorite: (idAttraction) => {
        return get().favorites.some(
            (favorite) =>
                Number(favorite.id_attraction) === Number(idAttraction)
        )
    },

    clearFavorites: () => {
        set({
            favorites: [],
            error: null
        })
    }
}))

export default useFavoritesStore