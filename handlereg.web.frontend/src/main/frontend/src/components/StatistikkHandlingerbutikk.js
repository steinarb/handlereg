import React from 'react';
import { Link } from 'react-router';
import { useGetHandlingerButikkQuery } from '../api';

export default function StatistikkHandlingerbutikk() {
    const { data: handlingerbutikk = [] } = useGetHandlingerButikkQuery();

    return (
        <div>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Antall handlinger gjort i butikk</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/statistikk">Tilbake</Link></li>
                </ul>
            </div>
            <div className="statistics-content-wrapper">
                <div>
                    <table className="pure-table pure-table-bordered">
                        <thead>
                            <tr>
                                <td>Butikk</td>
                                <td>Antall handlinger</td>
                            </tr>
                        </thead>
                        <tbody>
                            {handlingerbutikk.map((hb) =>
                                                  <tr key={'butikk' + hb.butikk.storeId}>
                                                      <td>{hb.butikk.butikknavn}</td>
                                                      <td>{hb.count}</td>
                                                  </tr>
                                                 )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
