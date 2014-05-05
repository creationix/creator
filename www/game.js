/*global PIXI*/
"use strict";
var width = window.innerWidth;
var height = window.innerHeight;


var renderer = PIXI.autoDetectRenderer(width, height);
var stage = new PIXI.Stage(0);
document.body.textContent = "";
document.body.appendChild(renderer.view);

var loader = new PIXI.AssetLoader(["sprites/planet-cute.json"]);
loader.onComplete = onAssetsLoaded;
loader.load();

function onAssetsLoaded() {

  draw(14, 4, 10,
   "GDwwDGGGGSSSSG"+"              "+"              "+"         8112 "+
   "GGDwwDGGGSSSSG"+"       '      "+"              "+"         7WW3 "+
   "GGDwwDGGGSSSSG"+",     T  W#!W "+"         W  W "+"         6554 "+
   "GGGDwwDGGGGSGG"+"              "+"              "+"              "+
   "GGGGDwwDGGGSGG"+"  T         t "+"              "+"              "+
   "GGGGGDwwDGGSGG"+" R            "+"              "+"              "+
   "GSSSSSwwSSSSSS"+"R   <S  S> @  "+"     <SS>     "+"      *       "+
   "GGGGGDwwDGGGGG"+" R         ^  "+"              "+"              "+
   "GGGGDwwwDGGGGG"+"  .        S x"+"           ^  "+"              "+
   "GGGDwwwwwDGGGG"+"T         S S "+"          <S> "+"           K  ",
  {
    G: "Grass Block",
    W: "Wood Block",
    D: "Dirt Block",
    S: "Stone Block",
    w: "Water Block",
    "v": "Ramp South",
    ">": "Ramp East",
    "^": "Ramp North",
    "<": "Ramp West",
    "1": "Roof North",
    "2": "Roof North East",
    "3": "Roof East",
    "4": "Roof South East",
    "5": "Roof South",
    "6": "Roof South West",
    "7": "Roof West",
    "8": "Roof North West",
    "!": "Door Tall Closed",
    "#": "Window Tall",
    "T": "Tree Tall",
    "t": "Tree Short",
    "x": "Tree Ugly",
    "R": "Rock",
    "h": "Heart",
    "*": "Enemy Bug",
    "@": "Character Boy",
    "K": "Key",
    ",": "Gem Blue",
    ".": "Gem Green",
    "'": "Gem Orange",
  });
 renderer.render(stage);

}

function draw(w, h, d, grid, names) {
  var i = 0;
  var left = (width - w * 100) >>> 1;
  var top = (height - d * 80 + h * 40 - 180) >>> 1;
  for (var z = 0; z < d; z++) {
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var name = names[grid[i++]];
        if (!name) continue;
        var block = PIXI.Sprite.fromFrame(name);
        block.position.x = left + x * 100;
        block.position.y = top + z * 80 - y * 40;
        stage.addChild(block);
      }
    }
  }
}
