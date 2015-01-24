module("main", function* () {
  var tempFs = yield* load("plugins/temp-filesystem");
  var menu = yield* load('core/menu');
  var fs = yield* load('core/vfs');

  yield* tempFs.enable();
  yield* tree("/tmp");
  yield* fs.mkfile("/tmp/foo/bar/baz.txt", "Hello World\n");
  yield* tree("/tmp");
  yield* fs.copy("/tmp/foo/bar", "tmp/lot/bot");
  yield* tree("/tmp");
  yield* fs.rename("/tmp/foo/bar", "tmp/foo/b/a/r");
  yield* tree("/tmp");
  yield* fs.copy("tmp", "tmp/copy");
  yield* tree("/tmp");

  function* tree(path) {
    var stat = yield* fs.stat(path);
    console.log(path || "/", stat);
    if (stat.type == "dir") {
      var names = yield* fs.readdir(path);
      for (var i = 0, l = names.length; i < l; ++i) {
        yield* tree(path + "/" + names[i]);
      }
    }
  }

  console.group("Menu Items");
  for (name in menu) {
    console.log(name);
  }
  console.groupEnd();
});
