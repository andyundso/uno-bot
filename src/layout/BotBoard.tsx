import * as React from 'react'
import {ICard} from "../types";

interface Props {
    botNumber: number;
    cards: ICard[];
    currentPlayer: number;
}

export const BotBoard = ({botNumber, cards, currentPlayer}: Props) =>
    <div style={{
        alignItems: 'center',
        backgroundColor: 'white',
        border: (botNumber - 1 === currentPlayer ? "5px solid #1C6EA4" : ""),
        boxSizing: "border-box",
        height: '100%',
        float: 'left',
        width: '33%'
    }}>
        <p>Bot No. {botNumber}</p>
        <p>Amount of cards: {cards.length}</p>
    </div>;
