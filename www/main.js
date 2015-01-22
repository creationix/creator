module("main", function* () {
  var tempFs = yield* load("plugins/temp-filesystem");
  var menu = yield* load('core/menu');
  var vfs = yield* load('core/vfs');
  for (var name in menu) {
    console.log(name, menu[name]);
  }
  yield* tempFs.enable();
  console.log("vfs", vfs);
  for (name in menu) {
    console.log(name, menu[name]);
  }
});
