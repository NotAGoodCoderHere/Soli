import Card from "./card";

export default class Foundation {
  #foundation: Card[][] = [[], [], [], []];
  Clear() {
    for (var i = 0; i < this.#foundation.length; i++)
      this.#foundation[i].length = 0;
    return this;
  }
  Push() {
    if (arguments.length == 1) {
      this.AutoPush();
    } else if (arguments.length == 2) {
    }
  }
  AutoPush() {}
}
