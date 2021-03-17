import React from 'react';
import App from './App';
import { useGun } from './hooks/useGUN';

export function Super() {
    const gun = useGun();
    return <App gun={gun} />;
}
