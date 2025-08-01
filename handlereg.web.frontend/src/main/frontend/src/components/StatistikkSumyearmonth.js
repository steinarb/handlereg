import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import { useGetSumYearMonthQuery } from '../api';

export default function StatistikkSumyearmonth() {
    const { data: sumyearmonth = [] } = useGetSumYearMonthQuery();
    const navigate = useNavigate();
    const swipeHandlers = useSwipeable({
        onSwipedRight: async () => navigate('/statistikk'),
    });

    return (
        <div {...swipeHandlers}>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Sum for år og måned</a>
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
                                <td>Måned</td>
                                <td>Handlebeløp</td>
                            </tr>
                        </thead>
                        <tbody>
                            {sumyearmonth.map((sym) =>
                                              <tr key={'year' + sym.year + sym.month}>
                                                  <td>{sym.year}</td>
                                                  <td>{sym.month}</td>
                                                  <td>{sym.sum}</td>
                                              </tr>
                                             )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
