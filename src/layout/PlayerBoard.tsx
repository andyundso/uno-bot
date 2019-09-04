import * as React from 'react'
import {Card} from "./Card";
import {ICard} from "../types";

interface Props {
    cards: ICard[];
    onClick: (cardId: number) => void;
}

export const PlayerBoard = ({cards, onClick}: Props) =>
    <div style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-evenly',
        height: '100%',
        width: '100%'
    }}>
        {cards.map((c: ICard) => <Card onClick={() => onClick(c.key)} {...c}/>)}
    </div>;
