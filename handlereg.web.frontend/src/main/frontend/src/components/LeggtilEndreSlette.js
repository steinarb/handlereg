import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import ChevronRight from './bootstrap/ChevronRight';

export default function LeggtilEndreSlette() {
    const navigate = useNavigate();
    const swipeHandlers = useSwipeable({
        onSwipedRight: async () => navigate('/'),
        onSwipedLeft: async () => navigate('/favoritter'),
    });

    return (
        <div {...swipeHandlers}>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Lagre/Endre/Slette</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/">Opp</Link></li>
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
