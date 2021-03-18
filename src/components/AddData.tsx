import React from 'react';
import { UseGunType } from '../hooks/useGUN';

type AddDataProps = {
    gun: UseGunType;
    onSubmit: VoidFunction;
    onDone: (result: any) => void;
}

export function AddData({ gun, onSubmit, onDone }: AddDataProps) {
    const [document, setDocument] = React.useState<string | undefined>();
    const [key, setKey] = React.useState<string | undefined>();
    const [value, setValue] = React.useState<string | undefined>();
    const [encryptionKey, setEncryptionKey] = React.useState<string | undefined>();

    const addData = async () => {
        onSubmit();
        if (!document || !key || !value) {
            return alert('Fields not filled')
        }
        const data = { [key]: value }
        console.log('adding', data, 'to', document)
        const result = await gun.addData(document, key, value, encryptionKey);
        console.log('got result:', result);
        onDone(result);
    }

    return (
        <div>
            <h2>Add data</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                addData();
            }}>
                <label>Document</label>
                <input onChange={(e) => setDocument(e.target.value)} type="text"></input>

                <label>Key</label>
                <input onChange={(e) => setKey(e.target.value)} type="text"></input>

                <label>Value</label>
                <input onChange={(e) => setValue(e.target.value)} type="text"></input>

                <label>Encrypt?</label>
                <input onChange={(e) => setEncryptionKey(e.target.value)} type="text"></input>

                <button type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}
