import React from 'react';
import { UseGunType } from '../hooks/useGUN';

type GetDataProps = {
    gun: UseGunType;
    onSubmit: VoidFunction;
    onDone: (data: string) => void;
}

export function GetData({ gun, onSubmit, onDone }: GetDataProps) {
    const [document, setDocument] = React.useState<string | undefined>();
    const [key, setKey] = React.useState<string | undefined>();
    const [decryptionKey, setDecryptionKey] = React.useState<string | undefined>();

    const getData = async () => {
        onSubmit();
        if (!document) {
            return alert('key not set')
        }
        const result = await gun.getData(document, key, decryptionKey);
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
                <label>Document</label>
                <input onChange={(e) => setDocument(e.target.value)} type="text"></input>

                <label>Key</label>
                <input onChange={(e) => setKey(e.target.value)} type="text"></input>

                <label>Decrypt?</label>
                <input onChange={(e) => setDecryptionKey(e.target.value)} type="text"></input>

                <button type="submit">
                    Get data
                </button>

            </form>
        </div>
    )
}
