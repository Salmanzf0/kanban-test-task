import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
    const jwtToken = localStorage.getItem("token")
    return jwtToken ? <Outlet /> : <Navigate to={"/"} />
}

export default PrivateRoute;