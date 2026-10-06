const API_URL = import.meta.env.VITE_API_URL

export const getFavorites = async (token) => {
    const response = await fetch(`${API_URL}/api/v1/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Impossible de récupérer les favoris")
    }

    return response.json()
}

export const addFavoriteToApi = async (idAttraction, token) => {
    const response = await fetch(
        `${API_URL}/api/v1/profile/${idAttraction}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    const data = await response.json()

    if (!response.ok) {
        throw new Error("Impossible d'ajouter le favori")
    }

    return data
}

export const removeFavoriteFromApi = async (idAttraction, token) => {
    const response = await fetch(
        `${API_URL}/api/v1/profile/${idAttraction}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    if (!response.ok) {
        throw new Error("Impossible de supprimer le favori")
    }

    return response.json()
}