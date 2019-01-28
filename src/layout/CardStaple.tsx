import * as React from 'react';
import {Card} from "./Card";

interface Props {
    onClick: () => void
}

export const CardStaple = ({onClick}: Props) =>
    <Card verticalText color={'white'} onClick={onClick} value={'Karte ziehen'}/>;
