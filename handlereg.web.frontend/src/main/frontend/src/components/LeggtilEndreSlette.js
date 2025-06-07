import React from 'react';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';
import { StyledLinkRight } from './bootstrap/StyledLinkRight';


export default function LeggtilEndreSlette() {

    return (
        <div>
            <nav className="flex items-center justify-between flex-wrap bg-slate-100 p-6">
                <StyledLinkLeft to="/">Opp til matregnskap</StyledLinkLeft>
                <h1 className="text-3xl font-bold">Lagre/Endre/Slette</h1>
            </nav>
            <Container>
                <StyledLinkRight className="flex justify-end" to="/favoritter">Favoritter</StyledLinkRight>
                <StyledLinkRight className="flex justify-end mb-1" to="/nybutikk">Ny butikk</StyledLinkRight>
                <StyledLinkRight className="flex justify-end mb-1" to="/endrebutikk">Endre butikk</StyledLinkRight>
            </Container>
        </div>
    );
}
