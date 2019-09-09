import * as React from 'react'
import {Card} from "./Card";
import {ICard} from "../types";

interface Props {
    cards: ICard[];
    currentPlayer: number;
    onClick: (cardId: number) => void;
}

export const PlayerBoard = ({cards, currentPlayer, onClick}: Props) =>
    <div style={{
        alignItems: 'center',
        border: (3 === currentPlayer ? "5px solid #1C6EA4" : ""),
        boxSizing: "border-box",
        display: 'flex',
        justifyContent: 'space-evenly',
        height: '100%',
        width: '100%'
    }}>
        {cards.map((c: ICard) => <Card onClick={() => onClick(c.key)} {...c}/>)}
    </div>;
