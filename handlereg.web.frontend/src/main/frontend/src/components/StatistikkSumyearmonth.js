import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';

export default function StatistikkSumyearmonth() {
    const sumyearmonth = useSelector(state => state.sumyearmonth);

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <StyledLinkLeft to="/handlereg/statistikk">Tilbake</StyledLinkLeft>
                <h1>Handlesum for år og måned</h1>
                <div className="col-sm-2"></div>
            </nav>
            <Container>
                <div className="table-responsive table-sm table-striped">
                    <table className="table">
                        <thead>
                            <tr>
                                <td>År</td>
                                <td>Måned</td>
                                <td>Handlebeløp</td>
                            </tr>
                        </thead>
                        <tbody>
                            {sumyearmonth.map((sym) =>
                                              <tr key={'year' + sym.year}>
                                                  <td>{sym.year}</td>
                                                  <td>{sym.month}</td>
                                                  <td>{sym.sum}</td>
                                              </tr>
                                             )}
                        </tbody>
                    </table>
                </div>
            </Container>
        </div>
    );
}
