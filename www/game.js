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

  draw(8, 2, 6, [
    0,0,1,1,1,0,0,0, 0,0,0,0,0,0,0,0,
    0,2,2,1,1,1,1,1, 0,0,0,0,0,0,0,0,
    1,2,2,2,1,1,1,1, 0,0,3,3,3,0,0,0,
    1,1,1,2,1,1,1,1, 0,0,3,3,0,0,0,0,
    0,1,1,2,2,1,1,0, 0,0,0,0,0,0,0,0,
    0,0,1,2,2,0,0,0, 0,0,0,0,0,0,0,0,
  ], [ null,
    "Grass Block",
    "Water Block",
    "Stone Block",
  ]);
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
        var block = PIXI.Sprite.fromFrame(name);
        block.position.x = left + x * 100;
        block.position.y = top + z * 80 - y * 40;
        stage.addChild(block);
      }
    }
  }
}
