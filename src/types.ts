import * as React from "react";

export interface ActionCard extends ICard {
    type: "reverse"
}

export interface DistributedCards {
    cardStaple: ICard[];
    playerCardStaples: Array<ICard[]>;
}

export interface ICard {
    color: string;
    key: number;
    type: string;
    value?: number;
}

export interface IColorCard extends ICard {
    type: "color"
    value: number
}
