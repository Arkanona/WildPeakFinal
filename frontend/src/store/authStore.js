
import { create } from 'zustand'
import { loginUser, registerUser } from '../services/authService'

// Supprime les anciennes données d'authentification persistées
if (typeof window !== "undefined") {
    window.localStorage.removeItem("wildpeak-auth")
}

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    register: async (userData) => {
        try {
            set({
                loading: true,
                error: null
            })

            const data = await registerUser(userData)

            set({
                loading: false
            })

            return data

        } catch (error) {
            set({
                error: error.message,
                loading: false
            })

            throw error
        }
    },

    login: async (credentials) => {
        try {
            set({
                loading: true,
                error: null
            })

            const data = await loginUser(credentials)

            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                loading: false
            })

            return data

        } catch (error) {
            set({
                error: error.message,
                loading: false
            })

            throw error
        }
    },

    logout: () => {
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null
        })
    }
}))

export default useAuthStore
