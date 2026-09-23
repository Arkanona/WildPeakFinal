import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useFavoriteStore = create(
    persist(
        (set, get) => ({
            favorites: [],

            addFavorite: (id) => {
                const favoriteId = String(id)

                set((state) => {
                    if (state.favorites.includes(favoriteId)){
                        return state
                    }
                    return{

                        favorites: [...state.favorites, favoriteId]
                    }
                })
            },

            removeFavorite: (id) => {
                const favoriteId = String(id)

                set((state) => ({
                    favorites: state.favorites.filter(
                        (favorite) => favorite !== favoriteId
                    )
                }))
            },

            toggleFavorite: (id) => {
                const favoriteId = String(id)
                const favorites = get().favorites

                if(favorites.includes(favoriteId)){
                    set({
                        favorites: favorites.filter(
                            (favorite) => favorite !== favoriteId
                        )
                    })
                } else {
                    set({
                        favorites: [...favorites, favoriteId]
                    })
                }
            },

            isFavorite: (id) => {
                return get().favorites.includes(String(id))
            }
        }),
        {
            name: 'wildpeak-favorites'
        }
    )
)

export default useFavoriteStore