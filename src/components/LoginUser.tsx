import React from 'react';
import { UseGunType } from '../hooks/useGUN';

export function LoginUser({ gun, onSubmit, onLogin }: { gun: UseGunType, onSubmit: VoidFunction, onLogin: (ok: boolean, result: any) => void }) {
    const [email, setEmail] = React.useState<string | undefined>();
    const [pw, setPw] = React.useState<string | undefined>();

    const loginGunUser = async () => {
        onSubmit();
        if (!email || !pw) {
            return onLogin(false, 'email and pw must be set')
        }
        const { ok, result } = await gun.login(email, pw);
        onLogin(ok, result);
    }

    return (
        <div>
            <h2>Login User</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                loginGunUser();
            }}>
                <label>Email</label>
                <input onChange={(e) => setEmail(e.target.value)} type="text"></input>

                <label>Password</label>
                <input onChange={(e) => setPw(e.target.value)} type="text"></input>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
