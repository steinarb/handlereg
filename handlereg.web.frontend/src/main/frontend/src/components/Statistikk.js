import React from 'react';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';
import { StyledLinkRight } from './bootstrap/StyledLinkRight';

function Statistikk() {
    return (
        <div>
            <nav>
                <StyledLinkLeft to="/">Opp til matregnskap</StyledLinkLeft>
                <h1>Statistikk</h1>
                <div>&nbsp;</div>
            </nav>
            <Container>
                <StyledLinkRight to="/statistikk/sumbutikk">Totalsum pr. butikk</StyledLinkRight>
                <StyledLinkRight to="/statistikk/handlingerbutikk">Antall handlinger i butikk</StyledLinkRight>
                <StyledLinkRight to="/statistikk/sistehandel">Siste handel i butikk</StyledLinkRight>
                <StyledLinkRight to="/statistikk/sumyear">Total handlesum fordelt på år</StyledLinkRight>
                <StyledLinkRight to="/statistikk/sumyearmonth">Total handlesum fordelt på år og måned</StyledLinkRight>
            </Container>
        </div>
    );
}

export default Statistikk;
