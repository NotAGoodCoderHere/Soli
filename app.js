import Game from "./game.js";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(req.path, Date.now(), req.ip);
  return next();
});

const games = [];

app.get("/newgame", (req, res) => {
  var gm = new Game();
  games.push({ key: gm.id, value: gm });
  var answ = gm.ToJson();
  answ.id = gm.id;
  res.send(answ);
});

app.get("/games", (req, res) => {
  var answ = {};
  games.forEach((game) => {
    answ[game.key] = game.value.ToJson();
  });
  res.send(answ);
});

app.post("/game", (req, res) => {});

app.listen(3000, () => console.log("listening on port 3000"));
