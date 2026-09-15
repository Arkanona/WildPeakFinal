const API_URL = import.meta.env.VITE_API_URL

export const updateAttractionImage = async (attractionkId, file) => {
    const formData = new FormData()

    formData.append('image', file)

    const response = await fetch(`${API_URL}/api/attractions/${attractionkId}/image`,
        {
            method: 'PATCH',
            body: formData
        }
    )

    const data = await response.json

    return data
}