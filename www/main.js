module("main", function* () {
  var tempFs = yield* load("plugins/temp-filesystem");
  var menu = yield* load('core/menu');
  var vfs = yield* load('core/vfs');
  for (var name in menu) {
    console.log(name, menu[name]);
  }
  var fs = yield* tempFs.enable();
  yield* tree();
  yield* fs.mkfile("/foo/bar/baz.txt", "Hello World\n");
  yield* tree();
  yield* fs.copy("/foo/bar", "/lot/bot");
  yield* tree();
  yield* fs.rename("/foo/bar", "/foo/b/a/r");
  yield* tree();
  yield* fs.copy("", "copy");
  yield* tree();

  function* tree(path) {
    if (!path) {
      console.log();
      path = "";
    }
    var stat = yield* fs.stat(path);
    console.log(path || "/", stat);
    if (stat.type == "dir") {
      var names = yield* fs.readdir(path);
      for (var i = 0, l = names.length; i < l; ++i) {
        yield* tree(path + "/" + names[i]);
      }
    }
  }

  for (name in menu) {
    console.log(name, menu[name]);
  }
});
