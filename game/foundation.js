export default class Foundation {
  #foundation = [[], [], [], []];
  Clear() {
    for (var i = 0; i < this.#foundation.length; i++)
      this.#foundation[i].length = 0;
    return this;
  }
  Push() {
    if (arguments.length == 1) {
      this.autoPush();
    } else if (arguments.length == 2){
      push
    }

  }
}
