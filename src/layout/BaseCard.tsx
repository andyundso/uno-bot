import * as React from "react";

interface BaseCardProps {
    color: string
    onClick?: () => void
    value: string
    verticalText?: boolean
}

export const BaseCard = ({ color, onClick, value, verticalText }: BaseCardProps) =>
    <div onClick={onClick} style={{
        alignItems: 'center',
        backgroundColor: color,
        border: '3px solid black',
        borderRadius: '25px',
        display: 'flex',
        justifyContent: 'center',
        height: '200px',
        transform: verticalText ? 'rotate(90deg)' : undefined,
        width: '140px'
    }}>
        { value }
    </div>;
