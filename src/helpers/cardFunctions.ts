import {DistributedCards, ICard, IColorCard} from "../types";

export const generateCards = (): ICard[] => {
    const colors: string[] = ['blue', 'green', 'red', 'yellow'];
    const allCards: ICard[] = [];

    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((n: number) => {
        colors.forEach((t: string) => {
            const card: IColorCard = {
                color: t,
                type: "color",
                value: n,
            };

            allCards.push(card)
        })
    });

    // copy each cards again
    allCards.forEach((c: ICard) => allCards.push(c));
    colors.forEach((t: string) => {
        const card: IColorCard = {
            color: t,
            type: "color",
            value: 0,
        };

        allCards.push(card)
    });

    return allCards
};

export const distributeCards = (cards: ICard[]): DistributedCards => {
    const playerCards: ICard[] = [];
    const bot1Cards: ICard[] = [];
    const bot2Cards: ICard[] = [];
    const bot3Cards: ICard[] = [];

    for (let i: number = 0; i <= 2; i++) {
        for (let i: number = 0; i <= 2; i++) {
            playerCards.push(cards.shift()!)
        }

        for (let i: number = 0; i <= 2; i++) {
            bot1Cards.push(cards.shift()!)
        }

        for (let i: number = 0; i <= 2; i++) {
            bot2Cards.push(cards.shift()!)
        }

        for (let i: number = 0; i <= 2; i++) {
            bot3Cards.push(cards.shift()!)
        }
    }

    return {
        bot1Cards: bot1Cards,
        bot2Cards: bot2Cards,
        bot3Cards: bot3Cards,
        cardStaple: cards,
        playerCards: playerCards
    }
};
