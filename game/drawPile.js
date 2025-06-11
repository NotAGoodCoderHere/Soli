import Card from "./card";

export default class DrawPile {
  #drawPile = [];
  #drawn = [];
  Clear() {
    this.#drawPile.length = 0;
    return this;
  }
  Reset() {
    this.Clear();
    for (var suit = 0; suit < Card.suits.length; suit++) {
      for (var value = 1; value <= Card.cards.length; value++) {
        this.#drawPile.push(new Card(suit, value));
      }
    }
    return this;
  }

  Shuffle(n) {
    if (this.#drawPile.length < 2) return this;
    if (!n) n = 3;

    for (var i = 0; i < n; i++) {
      let currentIndex = this.#drawPile.length;
      while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [this.#drawPile[currentIndex], this.#drawPile[randomIndex]] = [
          this.#drawPile[randomIndex],
          this.#drawPile[currentIndex],
        ];
      }
    }

    return this;
  }

  Print() {
    for (var i = 0; i < this.#drawPile.length; i++)
      console.log(this.#drawPile[i]);
    return this;
  }

  Draw() {
    if (this.#drawPile.length < 1) {
      console.log("non ci sono carte da pescare");
      return this;
    }
    var card = this.#drawPile.pop();
    card.covered = false;
    this.#drawn.push(card);
    return this;
  }

  Refill() {
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
}
