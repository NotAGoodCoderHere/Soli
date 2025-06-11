export default class Tableau {
  #tableau = [[], [], [], [], [], [], []];

  Init(drawPile) {
    if (drawPile.length != 52) return this;
    this.Clear();
    for (var i = 0; i < this.#tableau.length; i++) {
      for (var k = 0; k < i + 1; k++) {
        var card = drawPile.pop();
        this.#tableau[i].push(card);
        if (k == i) card.covered = false;
      }
    }
    return this;
  }

  Print() {
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

  Clear() {
    for (var i = 0; i < this.#tableau.length; i++) this.#tableau[i].length = 0;
    return this;
  }

  CheckIfMoveIsValid() {}

  Move(from, to, n_cards) {
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
}
