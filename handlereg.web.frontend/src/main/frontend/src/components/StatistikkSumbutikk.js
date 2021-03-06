import React from 'react';
import { connect } from 'react-redux';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';

function StatistikkSumbutikk(props) {
    const { sumbutikk } = props;

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <StyledLinkLeft to="/handlereg/statistikk">Tilbake</StyledLinkLeft>
                <h1>Total handlesum fordelt på butikk</h1>
                <div className="col-sm-2"></div>
            </nav>
            <Container>
                <div className="table-responsive table-sm table-striped">
                    <table className="table">
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
            </Container>
        </div>
    );
}

const mapStateToProps = state => {
    const sumbutikk = state.sumbutikk;
    return {
        sumbutikk,
    };
};

export default connect(mapStateToProps)(StatistikkSumbutikk);
