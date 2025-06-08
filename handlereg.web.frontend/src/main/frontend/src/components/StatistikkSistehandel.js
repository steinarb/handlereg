import React from 'react';
import { useGetSisteHandelQuery } from '../api';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';

export default function StatistikkSistehandel() {
    const { data: sistehandel = [] } = useGetSisteHandelQuery();

    return (
        <div>
            <nav>
                <StyledLinkLeft to="/statistikk">Tilbake</StyledLinkLeft>
                <h1>Siste handel gjort i butikk</h1>
                <div>&nbsp;</div>
            </nav>
            <Container>
                <div>
                    <table>
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
            </Container>
        </div>
    );
}
