import DrawPile from "./drawPile";
import Card from "./card";

export default class Tableau {
  #tableau: Card[][] = [[], [], [], [], [], [], []];

  Init(drawPile: DrawPile) {
    this.Clear();

    for (var i = 0; i < this.#tableau.length; i++) {
      for (var k = 0; k < i + 1; k++) {
        var card = drawPile.Draw();
        if (card) {
          this.#tableau[i].push(card);
          if (k == i) card.covered = false;
        }
      }
    }
    return;
  }

  Stringify() {
    var str = "";
    this.#tableau.forEach((col) => {
      var cov = 0;
      var todo = true;
      col.forEach((card) => {
        if (card.covered) {
          cov++;
        } else {
          if (todo) {
            str += cov + "\t";
            todo = false;
          }
          str += card.Stringify() + "\t";
        }
      });
      str += "\n";
    });
    return str;
  }
  Clear() {
    for (var i = 0; i < this.#tableau.length; i++) this.#tableau[i].length = 0;
    return;
  }
  CheckIfMoveIsValid(from: number, to: number, n_cards: number): boolean {
    if (from < 1 || from > 7) return false;
    console.log("colonna iniziale esiste");

    if (to < 1 || to > 7) return false;
    console.log("colonna finale esiste");

    from--;
    to--;

    if (n_cards < 1) return false;
    console.log("stai muovendo almeno una carta");

    if (this.#tableau[from].length < n_cards) return false;
    console.log("ci sono abbastanza carte");

    for (
      var i = this.#tableau[from].length - n_cards;
      i < this.#tableau[from].length;
      i++
    ) {
      if (this.#tableau[from][i].covered) return false;
    }
    console.log("tutte le carte mosse sono coperte");

    var first_card = this.#tableau[from][this.#tableau[from].length - n_cards];

    if (this.#tableau[to].length != 0) {
      var last_card = this.#tableau[to].slice(-1)[0];

      if (first_card.color == last_card.color) return false;
      console.log("colore diverso");

      if (first_card.value != last_card.value - 1) return false;
      console.log("i valori vanno bene");
    } else {
      if (first_card.name != "K") return false;
      console.log("la prima è un Re");
    }

    return true;
  }

  Move(from: number, to: number, n_cards: number) {
    from--;
    to--;

    var temp = this.#tableau[from].slice(this.#tableau[from].length - n_cards);

    this.#tableau[from].length -= n_cards;

    if (this.#tableau[from].length > 0)
      this.#tableau[from][this.#tableau[from].length - 1].covered = false;

    this.#tableau[to] = this.#tableau[to].concat(temp);
  }
}
