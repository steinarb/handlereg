import React from 'react';
import { Link } from 'react-router';

export default function LeggtilEndreSlette() {

    return (
        <div>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Lagre/Endre/Slette</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/">Opp til matregnskap</Link></li>
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/favoritter">Favoritter</Link></li>
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/nybutikk">Ny butikk</Link></li>
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/endrebutikk">Endre butikk</Link></li>
                </ul>
            </div>
        </div>
    );
}
