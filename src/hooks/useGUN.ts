import Gun from 'gun/gun';
import { AccessObject } from 'gun/types/types';
require('gun/sea'); // this adds the user module to GUN
require('gun/lib/radix');
require('gun/lib/radisk');
require('gun/lib/store');
require('gun/lib/rindexed');

export type UseGunType = {
    createUser: (email: string, password: string) => Promise<string | undefined>;
    login: (email: string, password: string) => Promise<{ ok: boolean, result: any }>;
    resetPassword: (email: string, oldPassword: string, newPassword: string) => Promise<{ ok: boolean, result: string }>;
    getData: (document: string) => Promise<any>;
    addData: (document: string, key: string, value: any) => Promise<string>;
}

export function useGun(): UseGunType {

    console.log('using gun')
    // set localStorage to false to use indexedDB (>10mb storage)
    const gun = Gun({ peers: ['http://localhost:8080/gun', 'http://localhost:8090/gun'], localStorage: false });
    const user = gun.user();

    return {
        createUser: async (email: string, password: string) =>
            new Promise((resolve) => user.create(email, password, (ack) => {
                console.log(ack)
                if (Object.getOwnPropertyNames(ack).includes('ok')) {
                    resolve(undefined)
                } else{
                    resolve(JSON.parse(JSON.stringify(ack)).err)
                }
            })),
        login: (email: string, password: string) =>
            new Promise((resolve) => user.auth(email, password, (ack) => {
                console.log(ack)
                if (Object.getOwnPropertyNames(ack).includes('id')) {
                    resolve({ ok: true, result: 'Your public key is ' + (ack as any).get });
                } else {
                    resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err })
                }
            })),
        resetPassword: (email: string, oldPassword: string, newPassword: string) =>
            new Promise((resolve) => user.auth(email, oldPassword, (ack) => {
                console.log(ack)
                if (Object.getOwnPropertyNames(ack).includes('ok')) {
                    resolve({ ok: true, result: '' });
                } else {
                    resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err })
                }
            }, { change: newPassword })),
        getData: (document: string) =>
            new Promise((resolve) => user.get(document).once(resolve)),
        addData: (document: string, key: string, value: any) =>
            new Promise((resolve) => user.get(document).get(key).put(value as never, (ack) => {
                resolve(ack.ok ? 'Added data!' : ack.err?.message ?? 'Could not add data');
            }))
    }
}
