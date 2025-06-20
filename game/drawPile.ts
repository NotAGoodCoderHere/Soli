import Card from "./card";

export default class DrawPile {
  #drawPile: Card[] = [];
  #index = 0;
  Clear() {
    this.#drawPile.length = 0;
    return this;
  }
  NewPile() {
    this.Clear();
    for (var suit = 0; suit < Card.suits.length; suit++) {
      for (var value = 1; value <= Card.cards.length; value++) {
        this.#drawPile.push(new Card(suit, value));
      }
    }
    return this;
  }

  Shuffle(n: number) {
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

  Draw(): Card | null {
    if (this.#index >= this.#drawPile.length) {
      this.Refill();
      return null;
    }
    var card = this.#drawPile[this.#index];
    this.#drawPile.splice(this.#index, 1);
    return card;
  }
  Current() {
    if (this.#index >= this.#drawPile.length) return null;
    return this.#drawPile[this.#index];
  }
  Next() {
    this.#index++;
    if (this.#index >= this.#drawPile.length) this.Refill();
  }

  Refill() {
    if (this.#drawPile.length < 1) return;
    if (this.#index < this.#drawPile.length - 1) return;
    this.#index = 0;
  }
}
