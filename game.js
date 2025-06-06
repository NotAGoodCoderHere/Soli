import sha256 from "sha256";

export const suits = ["♥", "♦", "♣", "♠"];
export const cards = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export default class Game {
  #drawPile = [];
  #drawn = [];
  #foundation = [[], [], [], []];
  #tableau = [[], [], [], [], [], [], []];
  #starting_time = 0;
  #final_time = 0;
  #moves = 0;
  #score = 0;
  constructor() {
    this.StartGame();
    this.id = sha256(JSON.stringify(this.ToJson()));
  }

  ClearDrawPile() {
    this.#drawPile.length = 0;
    return this;
  }

  InitDrawPile() {
    this.ClearDrawPile();
    for (var suit = 0; suit < suits.length; suit++) {
      for (var value = 0; value < cards.length; value++) {
        var card = {};
        card["suit"] = suits[suit];
        card["name"] = cards[value];
        card["value"] = value + 1;
        card["covered"] = true;
        if (suits[suit] == "♥" || suits[suit] == "♦") {
          card["color"] = "red";
        } else {
          card["color"] = "black";
        }
        this.#drawPile.push(card);
      }
    }
    return this;
  }

  ShuffleDrawpile() {
    let currentIndex = this.#drawPile.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [this.#drawPile[currentIndex], this.#drawPile[randomIndex]] = [
        this.#drawPile[randomIndex],
        this.#drawPile[currentIndex],
      ];
    }
    return this;
  }

  LogDrawPile() {
    for (var i = 0; i < this.#drawPile.length; i++)
      console.log(this.#drawPile[i]);
    return this;
  }

  InitTableau() {
    if (this.#drawPile.length != 52) return;
    this.ClearTableau();
    for (var i = 0; i < this.#tableau.length; i++) {
      for (var k = 0; k < i + 1; k++) {
        var card = this.#drawPile.pop();
        this.#tableau[i].push(card);
        if (k == i) card.covered = false;
      }
    }
    return this;
  }

  PrintTableau() {
    var max_col_len = 0;
    for (var i = 0; i < this.#tableau.length; i++)
      if (this.#tableau[i].length > max_col_len)
        max_col_len = this.#tableau[i].length;
    var out = "1   2   3   4   5   6   7\n";
    for (var row = 0; row < max_col_len; row++) {
      for (var col = 0; col < this.#tableau.length; col++) {
        var card = this.#tableau[col][row];
        if (!card) out += "    ";
        else if (!card.covered) {
          out += this.#tableau[col][row].suit + this.#tableau[col][row].name;
          if (this.#tableau[col][row].name == "10") out += " ";
          else out += "  ";
        } else {
          out += "██  ";
        }
      }
      out += "\n";
    }
    console.log(out);
    return this;
  }

  ClearTableau() {
    for (var i = 0; i < this.#tableau.length; i++) this.#tableau[i].length = 0;
    return this;
  }

  MoveTableau(from, to, n_cards) {
    if (from < 1 || from > 7) {
      console.log("colonna iniziale non esiste");
      return this;
    }
    if (to < 1 || to > 7) {
      console.log("colonna finale non esiste");
      return this;
    }

    from--;
    to--;

    if (n_cards < 1) {
      console.log("devi muovere almeno una carta");
      return this;
    }
    if (this.#tableau[from].length < n_cards) {
      console.log("cerchi di muovere troppe carte");
      return this;
    }

    var temp = [];
    var valid = true;

    for (var i = 0; i < n_cards; i++) {
      var card = this.#tableau[from].pop();
      temp.push(card);
      if (card.covered) {
        valid = false;
        console.log("non puoi muovere carte coperte");
      }
    }

    // CONTROLLO VALIDITà MOSSA

    if (this.#tableau[to].length == 0 && temp[0].name != "K") {
      valid = false;
      console.log("solo i re nelle caselle vuote");
    } else if (
      this.#tableau[to].length != 0 &&
      temp.slice(-1)[0].value != this.#tableau[to].slice(-1)[0].value - 1
    ) {
      console.log(
        "i valori non coincidono",
        temp.slice(-1)[0].value,
        this.#tableau[to].slice(-1)[0].value
      );
      valid = false;
    } else if (
      this.#tableau[to].length != 0 &&
      temp.slice(-1)[0].color == this.#tableau[to].slice(-1)[0].color
    ) {
      console.log("stessto colore");
      valid = false;
    }

    // MOSSA
    if (valid) {
      this.#moves++;
      for (var i = 0; i < n_cards; i++) {
        this.#tableau[to].push(temp.pop());
      }

      // SCOPRI NUOVA CARTA
      if (this.#tableau[from].length > 0)
        this.#tableau[from][this.#tableau[from].length - 1].covered = false;

      //WIP SCORE
    } else {
      for (var i = 0; i < n_cards; i++) {
        this.#tableau[from].push(temp.pop());
      }
    }

    return this;
  }

  MoveFoundation(from, to) {
    if (false) {
    }
    return this;
  }

  ClearFoundation() {
    for (var i = 0; i < this.#foundation.length; i++)
      this.#foundation[i].length = 0;
    return this;
  }

  StartGame() {
    this.ClearDrawPile();
    this.#drawn = [];
    this.ClearFoundation();
    this.ClearTableau();
    this.#moves = 0;
    this.#score = 0;

    this.InitDrawPile()
      .ShuffleDrawpile()
      .ShuffleDrawpile()
      .ShuffleDrawpile()
      .InitTableau();

    this.#starting_time = Date.now();

    return this;
  }
  ToJson() {
    return {
      drawPile: this.#drawPile,
      drawn: this.#drawn,
      foundation: this.#foundation,
      tableau: this.#tableau,
      starting_time: this.#starting_time,
      final_time: this.#final_time,
      moves: this.#moves,
      score: this.#score,
    };
  }
}
