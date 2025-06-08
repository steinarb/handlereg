import React from 'react';
import { Link } from 'react-router';

function Statistikk() {
    return (
        <div>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Statistikk</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/">Opp til matregnskap</Link></li>
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/statistikk/sumbutikk">Totalsum pr. butikk</Link></li>
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/statistikk/handlingerbutikk">Antall handlinger i butikk</Link></li>
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/statistikk/sistehandel">Siste handel i butikk</Link></li>
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/statistikk/sumyear">Total handlesum fordelt på år</Link></li>
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/statistikk/sumyearmonth">Total handlesum fordelt på år og måned</Link></li>
                </ul>
            </div>
        </div>
    );
}

export default Statistikk;
