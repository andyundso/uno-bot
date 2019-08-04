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

export interface IBlueColorCard extends IColorCard {
    color: 'blue'
}

export interface IGreenColorCard extends IColorCard {
    color: 'green'
}

export interface IRedColorCard extends IColorCard {
    color: 'red'
}

export interface IYellowColorCard extends IColorCard {
    color: 'yellow'
}
