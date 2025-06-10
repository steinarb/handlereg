import React from 'react';
import { Link } from 'react-router';

export default function Favoritter() {
    return (
        <div>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Favoritter</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/leggetilendreslette">Legge til/Endre/Slette</Link></li>
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/favoritter/leggtil">Legg til favoritt</Link></li>
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/favoritter/slett">Slett favoritt</Link></li>
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/favoritter/sorter">Endre rekkefølge på favoritter</Link></li>
                </ul>
            </div>
        </div>
    );
}
