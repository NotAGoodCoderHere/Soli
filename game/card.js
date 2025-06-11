export default class Card {
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
  constructor(suit, value) {
    this.suit = suits[suit];
    this.name = cards[value - 1];
    this.value = value;
    this.covered = true;
    if (suits[suit] == "H" || suits[suit] == "D") {
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
}
