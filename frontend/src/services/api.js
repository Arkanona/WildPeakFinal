const API_URL = import.meta.env.VITE_API_URL

export const getParks = async () => {
    const response = await fetch(`${API_URL}/api/v1/parks`)

    if (!response.ok) {
        throw new Error('Error retrieving parks')
    }

    return response.json()
}

export const getAttractions = async () => {
    const response = await fetch(`${API_URL}/api/v1/attractions`)

    if (!response.ok) {
        throw new Error('Error retrieving attractions')
    }

    return response.json()
}