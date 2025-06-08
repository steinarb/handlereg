import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { usePostLoginMutation } from '../api';
import LoginMessage from './LoginMessage';

export default function Login() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const basename = useSelector(state => state.basename);
    const loginresultat = useSelector(state => state.loginresultat);
    const [ postLogin ] = usePostLoginMutation();

    if (loginresultat.suksess) {
        const originalRequestUrl = findReloadUrl(basename, loginresultat.originalRequestUrl);
        location.href = originalRequestUrl;
    }

    const onLoginClicked = async () => {
        await postLogin({ username, password: btoa(password) })
    }

    return (
        <div>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Handleregistrering login</a>
            </div>
            <div className="content-wrapper">
                <LoginMessage/>
                <form className="pure-form pure-form-aligned" onSubmit={e => { e.preventDefault(); }}>
                    <div className="pure-control-group">
                        <label htmlFor="username">Username:</label>
                        <input id="username" type="text" name="username" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="pure-control-group">
                        <label htmlFor="password">Password:</label>
                        <input id="password" type="password" name="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <div className="pure-control-group">
                        <input className="pure-button pure-button-primary" type="submit" value="Login" onClick={onLoginClicked}/>
                    </div>
                </form>
            </div>
        </div>
    );
}

function findReloadUrl(basename, originalRequestUrl) {
    // If originalRequestUrl is empty go to the top.
    // If originalRequest is /unauthorized go to the top and let shiro decide where to redirect to
    if (!originalRequestUrl || originalRequestUrl === '/unauthorized') {
        return basename + '/';
    }

    return basename + originalRequestUrl;
}
