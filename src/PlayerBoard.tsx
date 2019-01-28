import * as React from 'react'
import {Card} from "./layout/Card";
import {ICard} from "./types";

interface Props {
    cards: ICard[]
}

export class PlayerBoard extends React.Component<Props> {
    public render() {
        return (
            <div style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                height: '100%',
                'width': '100%'
            }}>
                {this.props.cards.map((c: ICard) => <Card key={`${c.color}_${c.value}`} color={c.color}
                                                          value={c.value}/>)}
            </div>
        )
    }
}
