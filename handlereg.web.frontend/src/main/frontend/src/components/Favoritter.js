import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import ChevronRight from './bootstrap/ChevronRight';

export default function Favoritter() {
    const navigate = useNavigate();
    const swipeHandlers = useSwipeable({
        onSwipedLeft: async () => navigate('/leggetilendreslette'),
        onSwipedRight: async () => navigate('/favoritter/leggtil'),
    });

    return (
        <div {...swipeHandlers}>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Favoritter</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/leggetilendreslette">Opp</Link></li>
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
