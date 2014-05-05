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
   "GDwwDGGGGSSSSG"+"              "+"              "+"              "+
   "GGDwwDGGGSSSSG"+"       '      "+"              "+"         8112 "+
   "GGDwwDGGGSSSSG"+",     T       "+"         W  W "+"         7WW3 "+
   "GGGDwwDGGGGSGG"+"         W#!W "+"         W  W "+"         6554 "+
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
  var top = (height - d * 80) >>> 1;
  for (var z = 0; z < d; z++) {
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var name = names[grid[i++]];
        if (!name) continue;
        var px = left + x * 100;
        var py = top + z * 80 - y * 40;
        // if (px < -10 || px > width || py < -10 || py > height) continue;
        var block = PIXI.Sprite.fromFrame(name);
        block.position.x = px;
        block.position.y = py;
        stage.addChild(block);
      }
    }
  }
}
