export const readablePlayerName = (playerNumber: number):string => {
    return playerNumber === 3 ? 'You' : 'Bot ' + (playerNumber + 1)
};
