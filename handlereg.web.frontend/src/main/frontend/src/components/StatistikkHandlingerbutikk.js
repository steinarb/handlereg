import React from 'react';
import { connect } from 'react-redux';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';

function StatistikkHandlingerbutikk(props) {
    const { handlingerbutikk } = props;

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <StyledLinkLeft to="/handlereg/statistikk">Tilbake</StyledLinkLeft>
                <h1>Antall handlinger gjort i butikk</h1>
                <div className="col-sm-2"></div>
            </nav>
            <Container>
                <div className="table-responsive table-sm table-striped">
                    <table className="table">
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
            </Container>
        </div>
    );
}

const mapStateToProps = state => {
    const handlingerbutikk = state.handlingerbutikk;
    return {
        handlingerbutikk,
    };
};

export default connect(mapStateToProps)(StatistikkHandlingerbutikk);
