import {ICard} from "../types";

export const updateBotCardState = (cardToPlay: ICard, playerCardStaple: ICard[], playedCards: ICard[]) => {
    playerCardStaple = playerCardStaple.filter((card: ICard) => card.key !== cardToPlay!.key);
    playedCards.unshift(cardToPlay!);

    return {
        newPlayedCards: playedCards,
        playerCardStaple: playerCardStaple
    }
};