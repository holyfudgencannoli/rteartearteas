import { Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import getCookie from "./CookieGetter";

export default function LogoutButton({ setOpen }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const csrfToken = getCookie("csrf_token");
        

        try {
            const res = await fetch("http://localhost:5000/api/logout", {
                method: "POST", 
                headers: {
                    "X-CSRFToken": csrfToken,
                },
                credentials: "include"
            });
            if (!res.ok) throw new Error("Logout failed");
            
            alert('logout successful!')            
            setOpen(false)
            navigate("/login");
        } catch (err) {
            console.error(err);
            alert("Error logging out");
        }
    };

    return (
        
        <Button variant="outlined" color="danger" onClick={handleLogout}>
            Logout
        </Button>
    );
}
