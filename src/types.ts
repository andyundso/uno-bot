export interface DistributedCards {
    cardStaple: ICard[];
    playerCardStaples: Array<ICard[]>;
}

export interface ICard {
    color: string;
    key: number;
    type: string;
    value: number;
}

export interface IColorCard extends ICard {
    type: 'color'
}
