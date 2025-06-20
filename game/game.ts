import Tableau from "./tableu";
import DrawPile from "./drawPile";
import Card from "./card";
import Foundation from "./foundation";

export default class Game {
  #moves = 0;
  #score = 0;
  #starting_time = -1;

  #tableau = new Tableau();
  #drawPile = new DrawPile();
  #foundation = new Foundation();

  id: string;

  constructor() {
    this.StartGame();
    this.id = sha1(this.Encode() + Date.now());
  }

  StartGame() {
    /*this.ClearDrawPile();
    this.ClearFoundation();
    this.ClearTableau();
    */
    this.#drawPile.NewPile();
    this.#foundation.Clear();
    this.#tableau.Init(this.#drawPile);
    this.#moves = 0;
    this.#score = 0;

    //this.InitDrawPile().TripleShuffle().InitTableau();

    this.#starting_time = Date.now();

    return this;
  }
  Encode(): string {
    return "error";
  }
  Decode(str: string) {}
  Stringify(): string {
    return "tb: " + this.#tableau.Stringify();
  }

  T2T(from: number, to: number, n_cards: number) {
    if (this.#tableau.CheckIfMoveIsValid(from, to, n_cards))
      this.#tableau.Move(from, to, n_cards);
  }
  D2T() {}
  NXT() {}
  T2F() {}
  F2T() {}
  D2F() {}
}
