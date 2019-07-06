import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header } from './bootstrap/Header';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';
import butikk, { BUTIKK_LAGRE } from '../reducers/butikk';
const { BUTIKKNAVN_ENDRE, VELG_BUTIKK } = butikk.actions;
import { BUTIKKER_HENT } from '../reducers/butikker';

class EndreButikk extends Component {
    componentDidMount() {
        const { hentButikker } = this.props;
        hentButikker();
    }

    render() {
        const { valgtButikk, butikk, butikker, velgButikk, endreNavn, onLagreEndretButikk } = this.props;
        const { butikknavn, gruppe, rekkefolge } = butikk;
        const butikkerUnntattUndefined = butikker.filter(b => b.storeId > -1);

        return (
            <div>
                <StyledLinkLeft to="/handlereg">Opp til matregnskap</StyledLinkLeft>
                <Header>
                    <h1>Endre butikk</h1>
                </Header>
                <Container>
                    <form onSubmit={ e => { e.preventDefault(); }}>
                        <select size="10" value={valgtButikk} onChange={e => velgButikk(e.target.value, butikkerUnntattUndefined)}>
                            { butikkerUnntattUndefined.map((b, indeks) => <option value={indeks}>{b.butikknavn}</option>) }
                        </select>
                        <div className="form-group row">
                            <label htmlFor="amount" className="col-form-label col-5">Ny butikk</label>
                            <div className="col-7">
                                <input id="amount" className="form-control" type="text" value={butikk.butikknavn} onChange={e => endreNavn(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-5"/>
                            <div className="col-7">
                                <button className="btn btn-primary" onClick={() => onLagreEndretButikk(butikk)}>Lagre endret butikk</button>
                            </div>
                        </div>
                    </form>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { valgtButikk, butikk, butikker } = state;
    return {
        valgtButikk,
        butikk,
        butikker,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        velgButikk: (indeks, butikker) => dispatch(VELG_BUTIKK({ indeks, butikker })),
        endreNavn: (butikknavn) => dispatch(BUTIKKNAVN_ENDRE(butikknavn)),
        hentButikker: () => dispatch(BUTIKKER_HENT()),
        onLagreEndretButikk: (nybutikk) => dispatch(BUTIKK_LAGRE(nybutikk)),
    };
};

EndreButikk = connect(mapStateToProps, mapDispatchToProps)(EndreButikk);
export default EndreButikk;
