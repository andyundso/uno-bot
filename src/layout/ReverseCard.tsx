import * as React from 'react'
import {BaseCard} from "./BaseCard";

interface Props {
    color: string;
    onClick?: () => void
}

export const ReverseCard = ({color, onClick}: Props) =>
    <BaseCard color={color} onClick={onClick} value={"Reverse Direction"} />
