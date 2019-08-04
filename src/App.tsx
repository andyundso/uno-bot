import 'izitoast/dist/css/iziToast.css';
import iziToast from "izitoast";
import * as React from 'react';
import './App.css';
import {updateBotCardState} from "./helpers/botFunctions";
import {distributeCards, generateCards, playableCards, validCard} from "./helpers/cardFunctions";
import {BotBoard} from "./layout/BotBoard";
import {Card} from "./layout/Card";
import {CardStaple} from "./layout/CardStaple";
import {PlayerBoard} from "./layout/PlayerBoard";
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
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            cardStaple: [],
            currentPlayer: 3,
            loading: true,
            playedCards: [],
            playerCardStaples: []
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

    public componentDidUpdate(prevState: Readonly<State>): void {
        if (prevState.currentPlayer !== this.state.currentPlayer) {
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

        this.setState({
            cardStaple: cardStaple,
            currentPlayer: (currentPlayer + 1) % 4,
            playedCards: playedCards,
            playerCardStaples: playerCardStaples
        })
    }

    public takeCard = () => {
        if (playableCards(this.state.playerCardStaples[playerNumber], this.state.playedCards[0])) {
            iziToast.show({
                color: 'red',
                message: 'Du kannst Karten ausspielen, daher musst du keine Karte ziehen!',
                position: 'topCenter',
            })
        } else {
            let newPlayerCardStaple: Array<ICard[]> = this.state.playerCardStaples;
            const cardStaple = this.state.cardStaple;
            const pickedCard = cardStaple.shift();
            newPlayerCardStaple[playerNumber].push(pickedCard!);

            this.setState({
                currentPlayer: 0,
                cardStaple: cardStaple,
                playerCardStaples: newPlayerCardStaple
            })
        }
    };

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
                iziToast.show({
                    color: 'red',
                    message: 'Du kannst diese Karte nicht spielen!',
                    position: 'topCenter',
                })
            }
        }
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
                        <div style={{backgroundColor: 'black', float: 'left', height: '100%', width: '33%'}}/>
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
