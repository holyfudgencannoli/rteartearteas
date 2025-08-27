import { Button } from "@mui/joy"
import { useNavigate } from "react-router-dom"


export default function LoginButton() {
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        
        navigate('/login')
    }



    return(
        <Button
            onClick={handleClick}
        >
            Login
        </Button>
    )
    
}