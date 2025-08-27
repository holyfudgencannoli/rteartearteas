import { Button, Input, inputClasses } from '@mui/joy';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getCookie from './CookieGetter';

export default function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [sessionToken, setSessionToken] = useState('')
    const [userId, setUserId] = useState(null)
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCsrf = async () => {
            const res = await fetch('http://localhost:5000/api/csrf-token', {
                credentials: 'include'
            });
            const data = await res.json();
            setSessionToken(data.csrf_token); // store CSRF token in state
        };
        fetchCsrf();
    }, []);




    const handleLogin = async (e) => {
        e.preventDefault();


        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)

        try{
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    "X-CSRFToken": sessionToken,
                },
                credentials: 'include',
                body: formData
            });

            if (!res.ok) throw new Error("Login failed!");
            const data = await res.json();
            setSessionToken(data.token)
            setUserId(data.user_id)
            alert('Login successful!')
            navigate('/dashboard', {
                state: { sessionToken: data.token, userId: data.user_id }
            });
        } catch (err) {
            console.error(err)
            alert('Invalid login!')
        }

    }

    return(

        <form id="login-box" method='POST' onSubmit={handleLogin}>
            <h4 id='login-text'>Login below or create a new account to get started.</h4>
            <label className="login-input-label">Username</label>
            <Input
                size='sm'
                style={{ width:'66%' }}
                type="text"
                name="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
            />            
            <label className="login-input-label">Password</label>
            <Input
                size='sm'
                style={{ width:'66%' }}
                type="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
            />
            <div id='login-box-buttons'>
                <a style={{ color: 'inherit' }} href="/signup"><Button id='signup-button' type='button'>Sign Up</Button></a>
                <Button id='login-button' type='submit'>Login</Button>
            </div>        
        </form>
    )
}