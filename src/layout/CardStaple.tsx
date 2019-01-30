import * as React from 'react';
import {Card} from "./Card";

interface Props {
    cardStapleCount: number
    onClick: () => void
}

export const CardStaple = ({cardStapleCount, onClick}: Props) =>
    <div style={{float: 'left', height: '100%', width: '33%'}}>
        <h4>Amount of cards in staple: {cardStapleCount}</h4>
        <div style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
        }}>
            <Card verticalText color={'white'} onClick={onClick} value={'Karte ziehen'}/>;
        </div>
    </div>;
