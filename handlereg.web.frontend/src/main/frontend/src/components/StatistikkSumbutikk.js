import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import { useGetSumButikkQuery } from '../api';

export default function StatistikkSumbutikk() {
    const { data: sumbutikk = [] } = useGetSumButikkQuery();
    const navigate = useNavigate();
    const swipeHandlers = useSwipeable({
        onSwipedLeft: async () => navigate('/statistikk'),
    });

    return (
        <div {...swipeHandlers}>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Sum per butikk</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/statistikk">Opp</Link></li>
                </ul>
            </div>
            <div className="content-wrapper">
                <div>
                    <table className="pure-table pure-table-bordered">
                        <thead>
                            <tr>
                                <td>Butikk</td>
                                <td>Total handlesum</td>
                            </tr>
                        </thead>
                        <tbody>
                            {sumbutikk.map((sb) =>
                                           <tr key={'butikk' + sb.butikk.storeId}>
                                               <td>{sb.butikk.butikknavn}</td>
                                               <td>{sb.sum}</td>
                                           </tr>
                                          )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
