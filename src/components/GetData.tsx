import React from 'react';
import { UseGunType } from '../hooks/useGUN';

type GetDataProps = {
    gun: UseGunType;
    onSubmit: VoidFunction;
    onDone: (data: string) => void;
}

export function GetData({ gun, onSubmit, onDone }: GetDataProps) {
    const [key, setKey] = React.useState<string | undefined>(undefined);

    const getData = async () => {
        onSubmit();
        if (!key) {
            return alert('key not set')
        }
        const result = await gun.getData(key);
        console.log('got result:', result)
        onDone(JSON.stringify(result));
    }

    return (
        <div>
            <h2>Get Data</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                getData();
            }}>
                <label>Key</label>
                <input onChange={(e) => setKey(e.target.value)} type="text"></input>
                <button type="submit">
                    Get data
                </button>

            </form>
        </div>
    )
}
