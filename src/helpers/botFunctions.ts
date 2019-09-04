import {ICard} from "../types";

export const updateBotCardState = (cardToPlay: ICard, playerCardStaple: ICard[], playedCards: ICard[]) => {
    playerCardStaple = playerCardStaple.filter((card: ICard) => card.key !== cardToPlay!.key);
    playedCards.unshift(cardToPlay!);

    return {
        newPlayedCards: playedCards,
        newPlayerCardStaple: playerCardStaple
    }
};

export const willCorrectlyYellUno = (cardStaple: ICard[]) => {
    return cardStaple.length === 1 && Math.random() < 0.9
};

export const willWronglyYellUno = (cardStaple: ICard[]) => {
    return cardStaple.length !== 1 && Math.random() > 0.98
};
