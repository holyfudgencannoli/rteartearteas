import { Button, Input } from '@mui/joy';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import getCookie from './CookieGetter';


export default function SignUp() {
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirm, setPasswordConfirm] = useState('')
    const [isAdmin, setIsAdmin] = useState('')

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const csrfToken = getCookie('csrf_token')


        const formData = new FormData()
        formData.append('email', email)
        formData.append('phone', phone)
        formData.append('username', username)
        formData.append('password', password)
        formData.append('is_admin', isAdmin)

        try{
            const res = await fetch('/api/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                        "X-CSRFToken": csrfToken,
                    },
                body: formData
            });

            if (!res.ok) throw new Error("Login failed!");
            const data = await res.json();

            alert(data.message)
            navigate('/', { credentials: 'include' });
        } catch (err) {
            console.error(err)
            alert('Error during registration!')
        }

    }


    const handleBackClick = () => {
        navigate(-1, {credentials: 'include'}); // Navigates one step back in the history
    };

    return(
        <div id='signup-box'>
            <form method='POST' onSubmit={handleSignup}>
                <label className="login-input-label">Email</label>
                <Input
                    size='sm'
                    style={{ width:'66%' }}
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                />
                <label className="login-input-label">Phone</label>
                <Input
                    size='sm'
                    style={{ width:'66%' }}
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                />
                <label className="login-input-label">Username*</label>
                <Input
                    size='sm'
                    style={{ width:'66%' }}
                    type="text"
                    name="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                />
                <label className="login-input-label">Password*</label>
                <Input
                    size='sm'
                    style={{ width:'66%' }}
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                />
                <label className="login-input-label">Confirm Password*</label>
                <Input
                    size='sm'
                    style={{ width:'66%' }}
                    type="password"
                    name="password_confirm"
                    value={password_confirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                />
                <input type="text" name='isAdmin' value={isAdmin} onChange={e => setIsAdmin(e.target.value)} />
                <Button type='submit'>Submit</Button>
            </form>
            <Button 
                variant="outlined" // Or "contained", "text"
                startIcon={<ArrowBackIcon />} 
                onClick={handleBackClick}
            >
            Back
            </Button>
        </div>
    )
}