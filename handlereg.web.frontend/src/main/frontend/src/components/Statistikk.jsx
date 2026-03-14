import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import ChevronRight from './bootstrap/ChevronRight';

function Statistikk() {
    const navigate = useNavigate();
    const swipeHandlers = useSwipeable({
        onSwipedRight: async () => navigate('/'),
        onSwipedLeft: async () => navigate('/statistikk/sumbutikk'),
    });

    return (
        <div {...swipeHandlers}>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Statistikk</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/">Opp</Link></li>
                </ul>
            </div>
            <div className="content-wrapper navigation-link-list">
                <Link className="pure-button" to="/statistikk/sumbutikk">Totalsum pr. butikk <ChevronRight/></Link>
                <Link className="pure-button" to="/statistikk/handlingerbutikk">Antall handlinger i butikk <ChevronRight/></Link>
                <Link className="pure-button" to="/statistikk/sistehandel">Siste handel i butikk <ChevronRight/></Link>
                <Link className="pure-button" to="/statistikk/sumyear">Total handlesum fordelt på år <ChevronRight/></Link>
                <Link className="pure-button" to="/statistikk/sumyearmonth">Total handlesum fordelt på år og måned <ChevronRight/></Link>
            </div>
        </div>
    );
}

export default Statistikk;
