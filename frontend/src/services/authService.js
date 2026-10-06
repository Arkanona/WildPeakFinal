const API_URL = import.meta.env.VITE_API_URL


export async function registerUser(userData) {

    const response = await fetch(
        `${API_URL}/api/v1/auth/register`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message)
    }

    return data
}


export async function loginUser(credentials) {

    const response = await fetch(
        `${API_URL}/api/v1/auth/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message)
    }

    return data
}

export const forgotPassword = async (email) => {
    const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi du lien")
    }

    return data
}

export const resetPassword = async (token, password) => {
    const response = await fetch(
        `${API_URL}/api/v1/auth/reset-password/${token}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password
            })
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message || "Erreur lors de la réinitialisation du mot de passe."
        )
    }

    return data
}