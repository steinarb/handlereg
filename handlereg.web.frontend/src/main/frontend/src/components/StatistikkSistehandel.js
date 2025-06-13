import React from 'react';
import { Link } from 'react-router';
import { useGetSisteHandelQuery } from '../api';

export default function StatistikkSistehandel() {
    const { data: sistehandel = [] } = useGetSisteHandelQuery();

    return (
        <div>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Siste handel i butikk</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/statistikk">Tilbake</Link></li>
                </ul>
            </div>
            <div className="content-wrapper">
                <div>
                    <table className="pure-table pure-table-bordered">
                        <thead>
                            <tr>
                                <td>Butikk</td>
                                <td>Sist handlet i</td>
                            </tr>
                        </thead>
                        <tbody>
                            {sistehandel.map((sh) =>
                                             <tr key={'butikk' + sh.butikk.storeId}>
                                                 <td>{sh.butikk.butikknavn}</td>
                                                 <td>{new Date(sh.date).toISOString().split('T')[0]}</td>
                                             </tr>
                                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
