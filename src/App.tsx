import 'izitoast/dist/css/iziToast.css';
import iziToast from "izitoast";
import * as React from 'react';
import './App.css';
import {distributeCards, generateCards, playableCards, validCard} from "./helpers/cardFunctions";
import {Card} from "./layout/Card";
import {CardStaple} from "./layout/CardStaple";
import {PlayerBoard} from "./layout/PlayerBoard";
import {DistributedCards, ICard} from "./types";

const playerNumber: number = 3;

interface Props {
}

interface State {
    cardStaple: ICard[];
    playedCards: ICard[];
    playerCardStaples: Array<ICard[]>
    loading: boolean;
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            cardStaple: [],
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

    public takeCard = () => {
        if (playableCards(this.state.playerCardStaples[playerNumber], this.state.playedCards[0])) {
            iziToast.show({
                color: 'red',
                message: 'Du kannst Karten ausspielen, daher musst du keine Karte ziehen!',
                position: 'topCenter',
            })
        } else {
            let newPlayerCardStaple: Array<ICard[]> = this.state.playerCardStaples;
            const cardStaple = this.state.cardStaple;
            const pickedCard = cardStaple.shift();
            newPlayerCardStaple[playerNumber].push(pickedCard!);

            this.setState({
                cardStaple: cardStaple,
                playerCardStaples: newPlayerCardStaple
            })
        }
    };

    public updatePlayerCardState = (cardId: number) => {
        const card = this.state.playerCardStaples[playerNumber].find((c: ICard) => c.key === cardId);
        if (card) {
            if (validCard(card, this.state.playedCards[0])) {
                let newPlayerCardStaples: Array<ICard[]> = this.state.playerCardStaples;
                const playedCards = this.state.playedCards;
                playedCards.unshift(card);
                const newPlayerCards = newPlayerCardStaples[playerNumber].filter((c: ICard) => c.key !== cardId);
                newPlayerCardStaples[playerNumber] = newPlayerCards

                this.setState({
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
                        <div style={{backgroundColor: 'white', float: 'left', height: '100%', width: '33%'}}/>
                        <div style={{backgroundColor: 'black', float: 'left', height: '100%', width: '33%'}}/>
                        <div style={{backgroundColor: 'white', float: 'left', height: '100%', width: '33%'}}/>
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
                        <PlayerBoard cards={this.state.playerCardStaples[playerNumber]} onClick={this.updatePlayerCardState}/>
                    </div>
                </div>
            )
        }
    }
}

export default App;
