import { sha1 } from "js-sha1"; // used to create the game id
import Tableau from "./tableu";
import DrawPile from "./drawPile";



export default class Game {

  constructor() {
    this.StartGame();
    this.id = sha1(Encode() + Date.now());
  }

  

  StartGame() {
    this.ClearDrawPile();
    this.ClearFoundation();
    this.ClearTableau();
    this.#moves = 0;
    this.#score = 0;

    this.InitDrawPile().TripleShuffle().InitTableau();

    this.#starting_time = Date.now();

    return this;
  }
  Encode() {}
  Decode(str) {}
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
