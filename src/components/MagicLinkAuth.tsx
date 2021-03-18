import React from 'react';
import { useLocation } from 'react-router';
import jwt from 'jsonwebtoken';
import { useNode } from '../hooks/useNode';
import { UseGunType } from '../hooks/useGUN';

type MagicLinkAuthProps = {
    gun: UseGunType;
}

export function MagicLinkAuth({ gun }: MagicLinkAuthProps) {
    const [email, setEmail] = React.useState<string | undefined>();
    const [token, setToken] = React.useState<string | undefined>();
    const [requestedLogin, setRequestedLogin] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
    const [hasEnteredPassword, setEnteredPassword] = React.useState<boolean>(false);
    const [password, setPassword] = React.useState<string | undefined>();
    const [key, setKey] = React.useState<string | undefined>();

    const location = useLocation();
    const node = useNode();

    React.useEffect(() => {
        console.log('location:', location)
        const search = location.search.split('&')
        const token = search.find((q) => q.match(''))?.split('=')[1];
        console.log('token:', token);
        if (token) {
            setToken(token);
        }
    }, [location]);

    React.useEffect(() => {
        console.log('logged in:', loggedIn)
        if (token) {
            console.log('setting logged in')
            const decoded = jwt.decode(token, { json: true });
            localStorage.setItem('token', token);
            setEmail(decoded?.email);
            setLoggedIn(true)
        }
    }, [token]);

    React.useEffect(() => {
        const getKey = async () => {
            if (loggedIn && email && password && hasEnteredPassword) {
                const {ok, result} = await gun.getKey(email, password)
                console.log('getKey', {ok, result})
                if (ok) {
                    setKey(result)
                } else {
                    const {ok, result} = await gun.setKey(email, password)
                    if (ok) {
                        setKey(result)
                    } else {
                        alert('could not create key :( ' + result)
                    }
                }
            }
        }
        getKey()
    }, [gun, loggedIn, email, password, hasEnteredPassword])

    const persistEmail = async () => {
        if (!email) {
            return alert('Email not set');
        }
        const encoder = new TextEncoder();
        const data = encoder.encode(email);
        const emailDigest = await crypto.subtle.digest('SHA-256', data);
        const hashHex = Array.from(new Uint8Array(emailDigest)).map((b) => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem('alias', hashHex);
    }

    const displayLoginForm = () => {
        return (
            !requestedLogin
                ?
                    <div>
                        <h2>Login</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (!email) {
                                return alert('Email not set')
                            }
                            await node.requestLogin(email)
                            setRequestedLogin(true)
                            await persistEmail()
                        }}>
                            <label>Email</label>
                            <input type="text" onChange={(e) => setEmail(e.target.value)}></input>

                            <button type="submit">Submit</button>
                        </form>
                    </div>
                :
                    <p>Requested login! Check your email for a link.</p>
        );
    }

    const displayLoggedIn = () => {
        return (
            <div>
                <h2>Your Dashboard</h2>
                <p>Logged in as {email}!</p>
                {!key
                    ? (
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            setEnteredPassword(true)
                        }}>
                            <label>Password</label>
                            <input type="text" onChange={(e) => setPassword(e.target.value)}></input>

                            <button type="submit">Submit</button>
                        </form>
                    ) :
                    (
                        <p>Your master key is {key}</p>
                    )
                }
            </div>
        );
    }

    return (
        <div>
            {!loggedIn ? displayLoginForm() : displayLoggedIn()}
        </div>
    )
}
