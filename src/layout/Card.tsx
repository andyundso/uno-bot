import * as React from 'react'

interface Props {
    color: string;
    onClick?: () => void
    value: number|string;
    verticalText?: boolean;
}

export class Card extends React.Component<Props> {
    public render() {
        return (
            <div onClick={this.props.onClick} style={{
                alignItems: 'center',
                backgroundColor: this.props.color,
                border: '3px solid black',
                borderRadius: '25px',
                display: 'flex',
                justifyContent: 'center',
                height: '80%',
                transform: this.props.verticalText ? 'rotate(90deg)' : undefined,
                width: '50%'
            }}>
                <h1>{this.props.value}</h1>
            </div>
        )
    }
}
