
import { NavLink, Outlet } from "react-router-dom";

export default function Layout(){
    return(
        <>
        <nav>
            <NavLink to = '/'>Home</NavLink>
            <NavLink to = '/signup'>Signup</NavLink>
            <NavLink to = '/login'>Login</NavLink>

        </nav>
        <Outlet />
        </>
    )

}