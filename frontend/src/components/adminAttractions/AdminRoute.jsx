
import { Navigate, useLocation } from "react-router-dom"
import useAuthStore from "../../store/authStore"

function AdminRoute({ children }) {
    const user = useAuthStore((state) => state.user)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    const location = useLocation()

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/connexion"
                state={{
                    from: location.pathname + location.search + location.hash
                }}
                replace
            />
        )
    }

    if (user?.role !== "admin") {
        return <Navigate to="/" replace />
    }

    return children
}

export default AdminRoute