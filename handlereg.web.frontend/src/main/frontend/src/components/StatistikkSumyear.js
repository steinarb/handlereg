import React from 'react';
import { Link } from 'react-router';
import { useGetSumYearQuery } from '../api';

export default function StatistikkSumyear() {
    const { data: sumyear = [] } = useGetSumYearQuery();

    return (
        <div>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Handlesum pr år</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/statistikk">Tilbake</Link></li>
                </ul>
            </div>
            <div className="statistics-content-wrapper">
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
