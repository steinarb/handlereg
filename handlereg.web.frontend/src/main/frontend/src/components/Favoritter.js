import React from 'react';
import { Link } from 'react-router';
import ChevronRight from './bootstrap/ChevronRight';

export default function Favoritter() {
    return (
        <div>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Favoritter</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/leggetilendreslette">Legge til/Endre/Slette</Link></li>
                </ul>
            </div>
            <div className="content-wrapper navigation-link-list">
                <Link className="pure-button" to="/favoritter/leggtil">Legg til favoritt <ChevronRight/></Link>
                <Link className="pure-button" to="/favoritter/slett">Slett favoritt <ChevronRight/></Link>
                <Link className="pure-button" to="/favoritter/sorter">Endre rekkefølge på favoritter <ChevronRight/></Link>
            </div>
        </div>
    );
}
