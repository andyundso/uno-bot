import * as React from 'react';
import './App.css';
import {distributeCards, generateCards} from "./helpers/cardFunctions";
import {Card} from "./layout/Card";
import {PlayerBoard} from "./PlayerBoard";
import {DistributedCards, ICard} from "./types";

interface Props {
}

interface State {
    bot1Cards: ICard[];
    bot2Cards: ICard[];
    bot3Cards: ICard[];
    cardStaple: ICard[];
    playedCards: ICard[];
    playerCards: ICard[];
    loading: boolean;
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            bot1Cards: [],
            bot2Cards: [],
            bot3Cards: [],
            cardStaple: [],
            loading: true,
            playedCards: [],
            playerCards: []
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
            this.setState({...distributedCards}, () => {
                const firstCard = this.state.cardStaple[0];
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

    public updatePlayerCardState = (cardId: number) => {
      const card = this.state.playerCards.find((c: ICard) => c.key === cardId);

      if (card) {
          const playedCards = this.state.playedCards;
          playedCards.unshift(card);
          const playerCards = this.state.playerCards.filter((c: ICard) => c.key !== cardId);

          this.setState({
              playedCards: playedCards,
              playerCards: playerCards
          })
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
                        <div style={{backgroundColor: 'black', float: 'left', height: '100%', width: '33%'}}/>
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
                        <PlayerBoard cards={this.state.playerCards} onClick={this.updatePlayerCardState}/>
                    </div>
                </div>
            )
        }
    }
}

export default App;
