import React from 'react';
import { Link } from 'react-router';
import { ChevronRight } from './ChevronRight';

export function StyledLinkRight(props) {
    const { className = '' } = props;
    return (
        <Link className={className + 'pure-button'} to={props.to} >
            {props.children} &nbsp;<ChevronRight/>
        </Link>
    );
}
