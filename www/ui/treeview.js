module("ui/treeview", function* () {
  "use strict";

  var vfs = yield* load('core/vfs');

  return TreeView;

  function TreeView(emit, refresh) {

    var stat, children, path, open, error;

    return {
      render: render
    };

    function render(newPath) {
      path = newPath;

      if (error) {
        return ["li", path, ["pre", error.stack]];
      }
      if (!stat) {
        run(function* () {
          stat = yield* vfs.stat(path);
        }, onFinish);
        return ["li", path, ["span", "..."]];
      }
      if (stat.type != "dir") {
        return ["li", path];
      }
      if (!open) {
        return ["li", path, ["button", {onclick:openTree}, "open"]];
      }
      if (!children) {
        run(function* () {
          children = yield* vfs.readdir(path);
        }, onFinish);
        return ["li", path, ["ul",
          ["li", "loading..."]
        ]];
      }
      return ["li", path, ["button", {onclick:closeTree}, "close"],
        ["ul",
          children.map(function (name) {
            return [TreeView, path + "/" + name];
          })
        ]
      ];
    }

    function openTree() {
      open = true;
      refresh();
    }

    function closeTree() {
      open = false;
      refresh();
    }

    function onFinish(err) {
      if (err) error = err;
      setImmediate(refresh);
    }

  }

});
