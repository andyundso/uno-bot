import 'izitoast/dist/css/iziToast.css';
import * as React from 'react';
import './App.css';
import {updateBotCardState} from "./helpers/botFunctions";
import {distributeCards, generateCards, playableCards, validCard} from "./helpers/cardFunctions";
import {readablePlayerName} from "./helpers/helpers";
import {ErrorMessage, SuccessMessage} from "./helpers/iziToast";
import {BotBoard} from "./layout/BotBoard";
import {Card} from "./layout/Card";
import {CardStaple} from "./layout/CardStaple";
import {PlayerBoard} from "./layout/PlayerBoard";
import {YellUno} from "./layout/YellUno";
import {DistributedCards, ICard} from "./types";

const playerNumber: number = 3;

interface Props {
}

interface State {
    cardStaple: ICard[];
    currentPlayer: number;
    playedCards: ICard[];
    playerCardStaples: Array<ICard[]>
    loading: boolean;
    yelledUno: Array<Boolean>
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            cardStaple: [],
            currentPlayer: 3,
            loading: true,
            playedCards: [],
            playerCardStaples: [],
            yelledUno: [false, false, false, false]
        }
    }

    public componentDidMount(): void {
        // also sort the cards randomly
        this.setState({
            cardStaple: generateCards().sort(function (a, b) {
                return 0.5 - Math.random()
            }),
        }, () => {
            const distributedCards: DistributedCards = distributeCards(this.state.cardStaple);
            this.setState({...distributedCards}, () => {
                const firstCard = this.state.cardStaple[0];
                const newCardStaple = this.state.cardStaple;
                newCardStaple.unshift();

                this.setState({
                    cardStaple: newCardStaple,
                    loading: false,
                    playedCards: [firstCard],
                })
            })
        });
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
        if (prevState.currentPlayer !== this.state.currentPlayer) {
            // check the uno calls from the last player
            this.checkForWrongUnoCalls(
                prevState.playerCardStaples[prevState.currentPlayer],
                prevState.currentPlayer
            );

            if (this.state.currentPlayer !== 3) {
                this.calculateBotTurn()
            }
        }
    }

    private calculateBotTurn() {
        let {cardStaple, playerCardStaples, playedCards} = this.state;
        const {currentPlayer} = this.state;
        const lastCard = this.state.playedCards[0];

        // determine if bot can play a card
        const playableCards = playerCardStaples[currentPlayer].filter((card: ICard) => card.color === lastCard.color || card.value === lastCard.value);

        if (playableCards.length > 0) {
            let {newPlayedCards, playerCardStaple} = updateBotCardState(playableCards.shift()!, playerCardStaples[currentPlayer], this.state.playedCards)
            playedCards = newPlayedCards;
            playerCardStaples[currentPlayer] = playerCardStaple;
        } else {
            // bot has nothing to play and needs to take a card
            const cardToTake = cardStaple.shift();
            playerCardStaples[currentPlayer].unshift(cardToTake!)
        }

        // bot has an 90 percent chance to yell uno or a 2 percent chance to wrongly call uno
        if ((playerCardStaples[currentPlayer].length === 1 && Math.random() < 0.9) ||
            playerCardStaples[currentPlayer].length !== 1 && Math.random() > 0.98) {
            this.yellUno()
        }

        this.setState({
            cardStaple: cardStaple,
            currentPlayer: (currentPlayer + 1) % 4,
            playedCards: playedCards,
            playerCardStaples: playerCardStaples
        })
    }

    private checkForWrongUnoCalls(prevCards: ICard[], prevPlayer: number) {
        if (prevCards.length === 1 && !this.state.yelledUno[prevPlayer]) {
            // player missed to yell uno and has to pick two additional cards
            ErrorMessage(readablePlayerName(prevPlayer) + ' missed to call uno and picks up two additional cards');
            this.takeTwoCards(prevPlayer)
        } else if (prevCards.length !== 1 && this.state.yelledUno[prevPlayer]) {
            // player wrongly called uno and has to take two cards as well
            ErrorMessage(readablePlayerName(prevPlayer) + ' called UNO too early and has to pick up two additional cards');
            this.takeTwoCards(prevPlayer)
        } else {
            if (!this.state.yelledUno.every(value => !value)) {
                this.setState({
                    yelledUno: [false, false, false, false]
                })
            }
        }
    }

    public takeCard = () => {
        if (playableCards(this.state.playerCardStaples[playerNumber], this.state.playedCards[0])) {
            ErrorMessage('Du kannst Karten ausspielen, daher musst du keine Karte ziehen!')
        } else {
            let newPlayerCardStaple: Array<ICard[]> = this.state.playerCardStaples;
            const cardStaple = this.state.cardStaple;
            const pickedCard = cardStaple.shift();
            newPlayerCardStaple[playerNumber].push(pickedCard!);

            // dont change the player if the picked card is playable
            this.setState({
                currentPlayer: validCard(pickedCard!, this.state.playedCards[0]) ? 3 : 0,
                cardStaple: cardStaple,
                playerCardStaples: newPlayerCardStaple
            })
        }
    };

    private takeTwoCards(playerNumber: number) {
        let {cardStaple, playerCardStaples} = this.state;
        const card1 = cardStaple.shift();
        const card2 = cardStaple.shift();
        playerCardStaples[playerNumber].push(card1!);
        playerCardStaples[playerNumber].push(card2!);

        this.setState({
            playerCardStaples, cardStaple
        })
    }

    public updatePlayerCardState = (cardId: number) => {
        const card = this.state.playerCardStaples[playerNumber].find((c: ICard) => c.key === cardId);
        if (card) {
            if (validCard(card, this.state.playedCards[0])) {
                let newPlayerCardStaples: Array<ICard[]> = this.state.playerCardStaples;
                const playedCards = this.state.playedCards;
                playedCards.unshift(card);
                newPlayerCardStaples[playerNumber] = newPlayerCardStaples[playerNumber].filter((c: ICard) => c.key !== cardId);

                this.setState({
                    currentPlayer: 0,
                    playedCards: playedCards,
                    playerCardStaples: newPlayerCardStaples
                })
            } else {
                ErrorMessage('Du kannst diese Karte nicht spielen!');
            }
        }
    };

    public yellUno = () => {
        let {yelledUno} = this.state;
        yelledUno[this.state.currentPlayer] = true;
        this.setState({yelledUno});
        SuccessMessage(readablePlayerName(this.state.currentPlayer) + ' yelled Uno!')
    };

    public render() {
        if (this.state.loading) {
            return 'Spiel wird initialisiert'
        } else {
            return (
                <div style={{height: '100%', width: '100%'}}>
                    <div style={{height: '33%', width: '100%'}}>
                        <BotBoard botNumber={1} cards={this.state.playerCardStaples[0]}/>
                        <BotBoard botNumber={2} cards={this.state.playerCardStaples[1]}/>
                        <BotBoard botNumber={3} cards={this.state.playerCardStaples[2]}/>
                    </div>

                    <div style={{height: '33%', width: '100%'}}>
                        <CardStaple cardStapleCount={this.state.cardStaple.length} onClick={this.takeCard}/>

                        <div style={{
                            alignItems: 'center',
                            backgroundColor: 'white',
                            display: 'flex',
                            float: 'left',
                            justifyContent: 'center',
                            height: '100%',
                            width: '33%'
                        }}>
                            <Card color={this.state.playedCards[0].color} value={this.state.playedCards[0].value}/>
                        </div>
                        <div style={{float: 'left', height: '100%', width: '33%'}}>
                            <YellUno onClick={this.yellUno}/>
                        </div>
                    </div>

                    <div style={{height: '33%'}}>
                        <PlayerBoard cards={this.state.playerCardStaples[playerNumber]}
                                     onClick={this.updatePlayerCardState}/>
                    </div>
                </div>
            )
        }
    }
}

export default App;
