import * as React from 'react'
import {ICard} from "../types";
import {ColorCard} from "./ColorCard";
import {ReverseCard} from "./ReverseCard";

export function Card({color, onClick, type, value}: ICard & { onClick?: () => void }) {
    switch (type) {
        case "color":
            return <ColorCard color={color} onClick={onClick} value={value || ""}/>;
        case "reverse":
            return <ReverseCard color={color} onClick={onClick} />;
        default:
            return <p>hello</p>
    }
}
