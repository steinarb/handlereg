import React from 'react';
import { Link } from 'react-router';
import { ChevronLeft } from './ChevronLeft';

export function StyledLinkLeft(props) {
    const { className = '' } = props;
    return (
        <Link className={className + ''} to={props.to} >
            <ChevronLeft/>&nbsp; {props.children}
        </Link>
    );
}
