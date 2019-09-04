import 'izitoast/dist/css/iziToast.css';
import * as React from 'react';
import './App.css';
import {updateBotCardState, willCorrectlyYellUno, willWronglyYellUno} from "./helpers/botFunctions";
import {distributeCards, generateCards, playableCards, randomlySortCards, validCard} from "./helpers/cardFunctions";
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
    gameFinished: Boolean;
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
            gameFinished: false,
            loading: true,
            playedCards: [],
            playerCardStaples: [],
            yelledUno: [false, false, false, false]
        }
    }

    public componentDidMount(): void {
        // also sort the cards randomly
        this.setState({
            cardStaple: randomlySortCards(generateCards()),
        }, () => {
            const distributedCards: DistributedCards = distributeCards(this.state.cardStaple);
            this.setState({...distributedCards}, () => {
                const firstCard = this.state.cardStaple[0];
                const newCardStaple = this.state.cardStaple;
                newCardStaple.unshift();

                this.setState({
                    cardStaple: newCardStaple,
                    gameFinished: false,
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

            if (this.state.cardStaple.length === 0) {
                this.putPlayedCardsToCardStaple()
            }
        }
    }

    private calculateBotTurn() {
        let {cardStaple, playedCards, playerCardStaples} = this.state;
        const {currentPlayer} = this.state;
        const lastCard = this.state.playedCards[0];
        let currentPlayerCardStaple = playerCardStaples[currentPlayer];

        // determine if bot can play a card
        const playableCards = currentPlayerCardStaple.filter((card: ICard) => card.color === lastCard.color || card.value === lastCard.value);

        if (playableCards.length > 0) {
            let {newPlayedCards, newPlayerCardStaple} = updateBotCardState(playableCards.shift()!, currentPlayerCardStaple, this.state.playedCards);
            playedCards = newPlayedCards;
            currentPlayerCardStaple = newPlayerCardStaple;
        } else {
            // bot has nothing to play and needs to take a card
            const cardToTake = cardStaple.shift();
            currentPlayerCardStaple.unshift(cardToTake!)
        }

        // bot has an 90 percent chance to yell uno or a 2 percent chance to wrongly call uno
        if (willCorrectlyYellUno(currentPlayerCardStaple) || willWronglyYellUno(currentPlayerCardStaple)) {
            this.yellUno()
        }

        playerCardStaples[currentPlayer] = currentPlayerCardStaple;

        this.setState({
            cardStaple: cardStaple,
            playedCards: playedCards,
            playerCardStaples: playerCardStaples
        }, () => {
            // look if the bot maybe finished the game
            if (playerCardStaples[currentPlayer].length === 0) {
                SuccessMessage(readablePlayerName(currentPlayer) + ' has won the game');
                this.setState({
                    gameFinished: true
                })
            } else {
                this.setState({
                    currentPlayer: (currentPlayer + 1) % 4,
                })
            }
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

    private putPlayedCardsToCardStaple() {
        let {playedCards} = this.state

        this.setState({
            cardStaple: randomlySortCards(playedCards)
        })
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
                    playedCards: playedCards,
                    playerCardStaples: newPlayerCardStaples
                }, () => {
                    if (newPlayerCardStaples[playerNumber].length === 0) {
                        SuccessMessage('You have won the game!')
                        this.setState({
                            gameFinished: true
                        })
                    } else {
                        this.setState({
                            currentPlayer: 0,
                        })
                    }
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
                    {this.state.gameFinished && <div id="dimScreen">
                        <div>
                            Game Finished! <button className="green-button"
                                                   onClick={() => this.componentDidMount()}>Wanna play again?</button>
                        </div>
                    </div>}
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
