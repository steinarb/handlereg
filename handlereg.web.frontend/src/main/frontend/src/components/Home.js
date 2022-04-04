import React from 'react';
import { Redirect } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    BELOP_ENDRE,
    BUTIKK_ENDRE,
    DATO_ENDRE,
    NYHANDLING_REGISTRER,
} from '../actiontypes';
import { Container } from './bootstrap/Container';
import { StyledLinkRight } from './bootstrap/StyledLinkRight';
import Kvittering from './Kvittering';


function Home(props) {
    const {
        loginresultat,
        oversikt,
        handlinger,
        butikker,
        nyhandling,
    } = props;
    const belop = nyhandling.belop.toString();
    const dispatch = useDispatch();
    if (!loginresultat.authorized) {
        return <Redirect to="/handlereg/unauthorized" />;
    }

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <a className="btn btn-primary left-align-cell" href="../.."><span className="oi oi-chevron-left" title="chevron left" aria-hidden="true"></span>&nbsp;Gå hjem!</a>
                <h1>Matregnskap</h1>
                <StyledLinkRight className="col-sm-2" to="/handlereg/hurtigregistrering">Hurtig</StyledLinkRight>
            </nav>
            <Container>
                <p>Hei {oversikt.fornavn}!</p>
                <p>Dine 5 siste innkjøp, er:</p>
                <div className="table-responsive table-sm table-striped">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="transaction-table-col1">Dato</th>
                                <th className="transaction-table-col2">Beløp</th>
                                <th className="transaction-table-col-hide-overflow transaction-table-col3">Butikk</th>
                            </tr>
                        </thead>
                        <tbody>
                            {handlinger.map((handling) =>
                                            <tr key={handling.transactionId}>
                                                <td>{new Date(handling.handletidspunkt).toISOString().split('T')[0]}</td>
                                                <td>{handling.belop}</td>
                                                <td className="transaction-table-col transaction-table-col-hide-overflow">{handling.butikk}</td>
                                            </tr>
                                           )}
                        </tbody>
                    </table>
                </div>
                <form onSubmit={ e => { e.preventDefault(); }}>
                    <div className="form-group row">
                        <label htmlFor="amount" className="col-form-label col-5">Nytt beløp</label>
                        <div className="col-7">
                            <input id="amount" className="form-control" type="number" pattern="\d+" value={belop} onChange={e => dispatch(BELOP_ENDRE(e.target.value))} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="jobtype" className="col-form-label col-5">Velg butikk</label>
                        <div className="col-7">
                            <select value={nyhandling.storeId} onChange={e => dispatch(BUTIKK_ENDRE(e.target.value))}>
                                {butikker.map(butikk => <option key={butikk.storeId} value={butikk.storeId}>{butikk.butikknavn}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="date" className="col-form-label col-5">Dato</label>
                        <div className="col-7">
                            <DatePicker
                                selected={new Date(nyhandling.handletidspunkt)}
                                dateFormat="yyyy-MM-dd"
                                onChange={selectedValue => dispatch(DATO_ENDRE(selectedValue))}
                                onFocus={e => e.target.blur()}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-5"/>
                        <div className="col-7">
                            <button className="btn btn-primary" disabled={nyhandling.belop <= 0} onClick={() => dispatch(NYHANDLING_REGISTRER({ ...nyhandling, username: oversikt.brukernavn }))}>Registrer handling</button>
                        </div>
                    </div>
                </form>
                <Kvittering/>
            </Container>
            <Container>
                <StyledLinkRight to="/handlereg/statistikk">Statistikk</StyledLinkRight>
                <StyledLinkRight to="/handlereg/nybutikk">Ny butikk</StyledLinkRight>
                <StyledLinkRight to="/handlereg/endrebutikk">Endre butikk</StyledLinkRight>
                <StyledLinkRight to="/handlereg/favoritter">Favoritter</StyledLinkRight>
            </Container>
        </div>
    );
}

const mapStateToProps = state => {
    const { loginresultat, oversikt, handlinger, butikker, nyhandling } = state;
    return {
        loginresultat,
        oversikt,
        handlinger,
        butikker,
        nyhandling,
    };
};

export default connect(mapStateToProps)(Home);
