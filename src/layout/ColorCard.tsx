import * as React from 'react'
import {BaseCard} from "./BaseCard";

interface Props {
    color: string;
    onClick?: () => void
    value: number | string;
}

export const ColorCard = ({color, onClick, value}: Props) =>
    <BaseCard color={color} onClick={onClick} value={String(value)} />
