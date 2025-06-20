export default class Card {
  suit: string;
  name: string;
  value: number;
  covered: boolean;
  color: string;

  static suits = ["H", "D", "C", "S"];
  static cards = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
  ];

  constructor(suit: number, value: number) {
    this.suit = Card.suits[suit];
    this.name = Card.cards[value - 1];
    this.value = value;
    this.covered = true;
    if (Card.suits[suit] == "H" || Card.suits[suit] == "D") {
      this.color = "red";
    } else {
      this.color = "black";
    }
  }
  Hide() {
    this.covered = true;
  }
  Reveal() {
    this.covered = false;
  }
  Stringify() {}
}
