import Gun from 'gun/gun';
import 'gun/sea'; // this adds the user module to GUN
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import { Wallet } from 'ethers';

export type UseGunType = {
    createUser: (email: string, password: string) => Promise<string | undefined>;
    login: (email: string, password: string) => Promise<{ ok: boolean, result: any }>;
    resetPassword: (email: string, oldPassword: string, newPassword: string) => Promise<{ ok: boolean, result: string }>;
    getData: (document: string, key?: string, decryptionKey?: string) => Promise<any>;
    addData: (document: string, key: string, value: any, encryptionKey?: string) => Promise<string>;
    getKey: (alias: string, password: string) => Promise<{ ok: boolean, result: string }>;
    setKey: (alias: string, password: string) => Promise<any>;
}

export function useGun(): UseGunType {

    console.log('using gun')
    // set localStorage to false to use indexedDB (>10mb storage)
    const gun = Gun({ peers: ['http://localhost:8080/gun', 'http://localhost:8090/gun'], localStorage: false });
    const user = gun.user();

    const createUser = async (email: string, password: string): Promise<string | undefined> =>
        new Promise((resolve) => user.create(email, password, (ack) => {
            console.log(ack)
            if (Object.getOwnPropertyNames(ack).includes('ok')) {
                resolve(undefined)
            } else {
                resolve(JSON.parse(JSON.stringify(ack)).err)
            }
        }));

    const login = (email: string, password: string): Promise<{ ok: boolean, result: any }>=>
        new Promise((resolve) => user.auth(email, password, (ack) => {
            console.log(ack)
            if (Object.getOwnPropertyNames(ack).includes('id')) {
                resolve({ ok: true, result: 'Your public key is ' + (ack as any).get });
            } else {
                resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err })
            }
        }))

    const addData = async (document: string, key: string, value: any, encryptionKey?: string): Promise<string> => {
        if (encryptionKey) {
            value = await Gun.SEA.encrypt(value, encryptionKey);
        }
        return new Promise((resolve) =>
            user.get(document).get(key).put(value as never, (ack) => {
                resolve(ack.ok ? 'Added data!' : ack.err?.message ?? 'Could not add data');
            })
        )
    }

    return {
        createUser,
        login,
        resetPassword: (email: string, oldPassword: string, newPassword: string) =>
            new Promise((resolve) => user.auth(email, oldPassword, (ack) => {
                console.log(ack)
                if (Object.getOwnPropertyNames(ack).includes('ok')) {
                    resolve({ ok: true, result: '' });
                } else {
                    resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err })
                }
            }, { change: newPassword })),
        getData: (document: string, key?: string, decryptionKey?: string) => {
            return new Promise((resolve) =>
                key
                    ? user.get(document).get(key).once(async (data) => {
                        console.log('data:', data)
                        decryptionKey
                            ? resolve(await Gun.SEA.decrypt(data, decryptionKey))
                            : resolve(data)
                    })
                    : user.get(document).once(resolve)
            )
        },
        addData,
        getKey: (alias: string, password: string) =>
            new Promise((resolve) =>
                gun.get(`~@${alias}`).once(async (exists) => {
                    if (!exists) {
                        const err = await createUser(alias, password);
                        if (err) {
                            resolve({ ok: false, result: err })
                        }
                    }
                    const { ok, result } = await login(alias, password);
                    if (!ok) {
                        resolve({ ok, result })
                    }

                    user.get('keys').get('master').once(async (data) => {
                        if (!data) {
                            resolve({ok: false, result: 'could not find key'})
                        } else {
                            const decrypted = await Gun.SEA.decrypt(data, password);
                            const wallet = new Wallet(decrypted as string);
                            resolve({ok: true, result: wallet.address});
                        }
                    })
        })),
        setKey: async (alias: string, password: string) =>
            new Promise((resolve) =>
                gun.get(`~@${alias}`).once(async (user) => {
                    if (!user) {
                        const err = await createUser(alias, password);
                        if (err) {
                            resolve({ ok: false, result: err })
                        }
                    }
                    const { ok, result } = await login(alias, password);
                    if (!ok) {
                        resolve({ ok, result })
                    }
                    const wallet = Wallet.createRandom()
                    const res = await addData('keys', 'master', wallet.privateKey, password)
                    if (res === 'Added data!') {
                        resolve({ok: true, result: wallet.address})
                    } else {
                        resolve({ok: false, result: res})
                    }
                })
            )
    }
}
