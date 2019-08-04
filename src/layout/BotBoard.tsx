import * as React from 'react'
import {ICard} from "../types";

interface Props {
    botNumber: number,
    cards: ICard[];
}

export const BotBoard = ({botNumber, cards}: Props) =>
    <div style={{
        alignItems: 'center',
        backgroundColor: 'white',
        float: 'left',
        height: '100%',
        width: '33%'
    }}>
        <p>Bot No. { botNumber }</p>
        <p>Amount of cards: {cards.length}</p>
    </div>;