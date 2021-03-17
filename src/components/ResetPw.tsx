import React from 'react';
import { UseGunType } from '../hooks/useGUN';

export function ResetPw({ gun, onSubmit, onChange }: { gun: UseGunType, onSubmit: VoidFunction, onChange: (ok: boolean, result: string) => void }) {
    const [email, setEmail] = React.useState<string | undefined>();
    const [oldPw, setOldPw] = React.useState<string | undefined>();
    const [newPw, setNewPw] = React.useState<string | undefined>();


    const resetGunUser = async () => {
        onSubmit();
        if (!email || !oldPw || !newPw) {
            return onChange(false, 'email and pw must be set')
        }
        const { ok, result } = await gun.resetPassword(email, oldPw, newPw);
        onChange(ok, result);
    }

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                resetGunUser();
            }}>
                <label>Email</label>
                <input onChange={(e) => setEmail(e.target.value)} type="text"></input>

                <label>Old Password</label>
                <input onChange={(e) => setOldPw(e.target.value)} type="text"></input>

                <label>New Password</label>
                <input onChange={(e) => setNewPw(e.target.value)} type="text"></input>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
