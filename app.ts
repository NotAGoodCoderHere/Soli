import Game from "./game/game"; //import functions that manage the game
import express from "express"; //libraray for the web
import bodyParser from "body-parser"; //library to semplify retrieving data from reqests

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(req.method, req.path, req.ip, Date.now());
  return next();
});

const games = new Map<string, Game>();

app.get("/newgame", (req, res) => {
  console.time("creazione mazzo");
  var gm = new Game();
  games.set(gm.id, gm);
  var answ = {
    game: gm.Stringify(),
    id: gm.id,
  };
  console.timeEnd("creazione mazzo");
  res.json(answ);
});

app.get("/games", (req, res) => {
  console.time("itera sulle partite");
  var gms = new Map<string, string>();

  games.forEach((v, k, m) => gms.set(k, v.Stringify()));
  console.log(gms);
  var out = {
    num: games.size,
  };

  console.timeEnd("itera sulle partite");
  res.json(out);
});

app.post("/game", (req, res) => {
  console.time("trova partita");
  var id = req.body.id;
  if (!id) return res.status(400);
  var game = games.get(id);
  if (!game) {
    console.timeEnd("trova partita");
    return res.status(404);
  }
  console.timeEnd("trova partita");
  return res.send(game.Stringify());
});

app.get("/game/:id", (req, res) => {
  console.time("trova partita");
  var id = req.params.id;
  if (!id) return res.status(400);
  var game = games.get(id);
  if (!game) {
    console.timeEnd("trova partita");
    return res.status(404);
  }
  console.timeEnd("trova partita");
  return res.json(game.ToJson());
});

app.post("/move/:id", (req, res) => {
  console.time("move");

  var id = req.params.id;
  var from = req.body.from;
  var to = req.body.to;
  var n_cards = req.body.n_cards;

  if (!id || !from || !to || !n_cards) {
    console.timeEnd("move");
    console.log("richiesta incompleta");
    return res.status(400);
  }

  var gm = games.get(id);

  if (!gm) {
    console.log("partita non trovata");
    return res.status(404);
  }

  gm.T2T(from, to, n_cards);

  res.json(gm.Stringify());
});

app.listen(3000, () => console.log("listening on port 3000"));
