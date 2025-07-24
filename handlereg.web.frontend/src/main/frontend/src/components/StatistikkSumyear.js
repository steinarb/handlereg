import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import { useGetSumYearQuery } from '../api';

export default function StatistikkSumyear() {
    const { data: sumyear = [] } = useGetSumYearQuery();
    const navigate = useNavigate();
    const swipeHandlers = useSwipeable({
        onSwipedLeft: async () => navigate('/statistikk'),
    });

    return (
        <div {...swipeHandlers}>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Handlesum pr år</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/statistikk">Opp</Link></li>
                </ul>
            </div>
            <div className="content-wrapper">
                <div>
                    <table className="pure-table pure-table-bordered">
                        <thead>
                            <tr>
                                <td>År</td>
                                <td>Handlebeløp</td>
                            </tr>
                        </thead>
                        <tbody>
                            {sumyear.map((sy) =>
                                         <tr key={'year' + sy.year}>
                                             <td>{sy.year}</td>
                                             <td>{sy.sum}</td>
                                         </tr>
                                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
