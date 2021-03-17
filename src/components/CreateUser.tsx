import React from 'react';
import { UseGunType } from '../hooks/useGUN';

export function CreateUser({ gun, onSubmit, onCreated }: { gun: UseGunType, onSubmit: VoidFunction, onCreated: (result?: string) => void }) {
    const [email, setEmail] = React.useState<string | undefined>();
    const [pw, setPw] = React.useState<string | undefined>();

    const createGunUser = async () => {
        onSubmit();
        if (!email || !pw) {
            return onCreated('email and pw must be set')
        }
        const result = await gun.createUser(email, pw);
        onCreated(result);
    }

    return (
        <div>
            <h2>Create User</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                createGunUser();
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
