import { sha1 } from "js-sha1"; // used to create the game id

export const suits = ["H", "D", "C", "S"];
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
  "T",
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
  #first_config = 0;
  constructor() {
    this.StartGame();
    this.id = sha1(JSON.stringify(this.ToJson()));
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
        if (suits[suit] == "H" || suits[suit] == "D") {
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
  TripleShuffle() {
    for (var i = 0; i < 3; i++) this.ShuffleDrawpile();
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
          out += this.#tableau[col][row].name + this.#tableau[col][row].suit;
          out += "  ";
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

  DrawFromDrawPile() {
    if (this.#drawPile.length < 1) {
      console.log("non ci sono carte da pescare");
      return this;
    }
    var card = this.#drawPile.pop();
    card.covered = false;
    this.#drawn.push(card);
    return this;
  }

  RefillDrawPile() {
    if (this.#drawPile.length != 0) {
      console.log("si può nacora pescare");
      return this;
    }
    if (this.#drawn.length == 0) {
      console.log("non hai ancora pescato");
      return this;
    }
    while (this.#drawn.length > 0) {
      var card = this.#drawn.pop();
      card.covered = true;
      this.#drawPile.push(card);
    }
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

    this.InitDrawPile().TripleShuffle().InitTableau();

    this.#starting_time = Date.now();

    return this;
  }
  ToJson() {
    //CARTE SCOPERTE

    var jstab = [];
    for (var i = 0; i < this.#tableau.length; i++) {
      var count = 0;
      var uncovered = [];
      for (var k = 0; k < this.#tableau[i].length; k++) {
        if (this.#tableau[i][k].covered) count++;
        else
          uncovered.push(this.#tableau[i][k].name + this.#tableau[i][k].suite);
      }
      var col = [count].concat(uncovered);
      jstab.push(col);
    }

    var jsfound = [];

    for (var i = 0; i < this.#foundation.length; i++) {
      jsfound.push(
        this.#foundation[i].length > 0
          ? this.#foundation[i].slice(-1)[0].name +
              this.#foundation[i].slice(-1)[0].suit
          : null
      );
    }

    return {
      candraw: this.#drawPile.length > 0,
      drawn:
        this.#drawn.length > 0
          ? this.#drawn.slice(-1)[0].name + this.#drawn.slice(-1)[0].suit
          : null,
      foundation: jsfound,
      tableau: jstab,
      starting_time: this.#starting_time,
      final_time: this.#final_time != 0 ? this.#final_time : null,
      moves: this.#moves,
      score: this.#score,
    };
  }
}
