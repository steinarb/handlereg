import React from 'react';
import { useSelector } from 'react-redux';
import { useGetLogoutMutation } from '../api';


export default function Unauthorized() {
    const loginresultat = useSelector(state => state.loginresultat);
    const [ getLogout ] = useGetLogoutMutation();

    const onLogoutClicked = async () => {
        await getLogout();
    }

    return (
        <div>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Ingen tilgang</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><a className="pure-menu-link" href="../..">Opp</a></li>
                </ul>
            </div>
            <div className="content-wrapper">
                <p>Hei {loginresultat.brukernavn}! Du har ikke tilgang til denne applikasjonen</p>
                <p>Klikk &quot;Opp&quot; for å navigere ut av applikasjonen, eller logg ut for å logge inn med en bruker som har tilgang</p>
                <form className="pure-form pure-form-aligned" onSubmit={ e => { e.preventDefault(); }}>
                    <div>
                        <div/>
                        <div>
                            <button className="pure-button pure-button-primary" onClick={onLogoutClicked}>Logg ut</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
