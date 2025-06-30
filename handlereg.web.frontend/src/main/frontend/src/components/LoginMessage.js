import React from 'react';
import { useSelector } from 'react-redux';

export default function LoginMessage() {
    const loginresultat = useSelector(state => state.loginresultat);
    if (!loginresultat.feilmelding) {
        return null;
    }

    return (
        <div class="alert alert-warning alert-white rounded" role="alert">
            <div class="icon"><i class="oi oi-warning"></i></div>
            {loginresultat.feilmelding}
        </div>
    );
}
