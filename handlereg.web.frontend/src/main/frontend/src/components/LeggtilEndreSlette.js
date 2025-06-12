import React from 'react';
import { Link } from 'react-router';
import ChevronRight from './bootstrap/ChevronRight';

export default function LeggtilEndreSlette() {

    return (
        <div>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Lagre/Endre/Slette</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/">Opp til matregnskap</Link></li>
                </ul>
            </div>
            <div className="content-wrapper navigation-link-list">
                <Link className="pure-button" to="/favoritter">Favoritter <ChevronRight/></Link>
                <Link className="pure-button" to="/nybutikk">Ny butikk <ChevronRight/></Link>
                <Link className="pure-button" to="/endrebutikk">Endre butikk <ChevronRight/></Link>
            </div>
        </div>
    );
}
