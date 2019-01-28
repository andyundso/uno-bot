import * as React from 'react'
import {Card} from "./layout/Card";
import {ICard} from "./types";

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
        {cards.map((c: ICard) => <Card key={c.key} color={c.color}
                                       onClick={() => onClick(c.key)
                                       } value={c.value}/>)}
    </div>;