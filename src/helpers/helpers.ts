export const readablePlayerName = (playerNumber: number): string => {
    return playerNumber === 3 ? 'You' : 'Bot ' + (playerNumber + 1)
};

export const nextPlayer = (playerNumber: number, reverseDirection: boolean) => {
    const theoreticalNextPlayer: number = reverseDirection ? playerNumber - 1 : playerNumber + 1;
    console.log(theoreticalNextPlayer);
    return theoreticalNextPlayer === -1 ? 3 : theoreticalNextPlayer % 4
};

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
