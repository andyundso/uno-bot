import {ActionCard, DistributedCards, ICard, IColorCard} from "../types";

export const generateCards = (): ICard[] => {
    const colors: string[] = ['blue', 'green', 'red', 'yellow'];
    const allCards: ICard[] = [];
    let i: number = 1;

    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((n: number) => {
        colors.forEach((t: string) => {
            const card: IColorCard = {
                color: t,
                key: i,
                type: "color",
                value: n,
            };

            allCards.push(card);
            i++;
        })
    });

    // copy each cards again
    allCards.forEach((c: ICard) => {
        const clonedCard: ICard = Object.assign({}, c);
        clonedCard.key = i;
        allCards.push(clonedCard);
        i++
    });

    colors.forEach((t: string) => {
        const card: IColorCard = {
            color: t,
            key: i,
            type: "color",
            value: 0,
        };

        allCards.push(card);
        i++;
    });

    // add reverse card
    colors.forEach((t: string) => {
        const card: ActionCard = {
            color: t,
            key: i,
            type: "reverse",
        };

        allCards.push(card);
        i++;
    });

    return allCards
};

export const distributeCards = (cards: ICard[]): DistributedCards => {
    const playerCardStaples: Array<ICard[]> = [];
    Array.from({length: 4}).forEach((x, i) => {
        playerCardStaples.push([])
    });

    for (let i: number = 0; i <= 2; i++) {
        Array.from({length: 4}).forEach((x, i) => {
            for (let j: number = 0; j <= 2; j++) {
                playerCardStaples[i].push(cards.shift()!)
            }
        });
    }

    return {
        cardStaple: cards,
        playerCardStaples: playerCardStaples
    }
};

export const playableCards = (cards: ICard[], lastCard: ICard) => {
    return cards.map((c: ICard) => validCard(c, lastCard)).includes(true)
};

export const randomlySortCards = (cards: ICard[]) => {
    return cards.sort(function (a, b) {
        return 0.5 - Math.random()
    })
};

export const validCard = (cardToPlay: ICard, lastCard: ICard) => {
    return cardToPlay.color === lastCard.color || cardToPlay.value === lastCard.value
};
