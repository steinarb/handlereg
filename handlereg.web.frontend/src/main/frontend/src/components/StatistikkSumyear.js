import React from 'react';
import { useGetSumYearQuery } from '../api';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';

export default function StatistikkSumyear() {
    const { data: sumyear = [] } = useGetSumYearQuery();

    return (
        <div>
            <nav>
                <StyledLinkLeft to="/statistikk">Tilbake</StyledLinkLeft>
                <h1>Handlesum pr år</h1>
                <div>&nbsp;</div>
            </nav>
            <Container>
                <div>
                    <table>
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
            </Container>
        </div>
    );
}
