/*jshint browser:true*/
module("plugins/temp-filesystem", function* () {
  "use strict";
  var sha1 = yield* load('lib/sha1');
  var vfs = yield* load('core/vfs');
  var menu = yield* load('core/menu');

  var enableCommand = "Temp Filesystem: Enable";
  var disableCommand = "Temp Filesystem: Disable";

  menu[enableCommand] = enable;

  var root = null;

  // mode is one of the strings "file", "exec", "sym", or "dir"

  function makeEntry(data, mode) {
    // If data is a string, encode it as UTF-8
    if (typeof data == "string") {
      var raw = window.unescape(encodeURIComponent(data));
      var length = raw.length;
      data = new Uint8Array(length);
      for (var i = 0; i < length; ++i) {
        data[i] = raw.charCodeAt(i);
      }
    }
    var entry = Object.create(null);
    entry.data = data;
    entry.mode = mode;
    entry.hash = sha1(data);
    return entry;
  }

  function makeTree() {
    var entry = Object.create(null);
    entry.entries = Object.create(null);
    return hashTree(entry);
  }

  function hashTree(tree) {
    var entries = tree.entries;
    tree.hash = sha1(Object.keys(entries).sort().map(function (name) {
      return name + entries[name].hash;
    }).join(""));
    if (tree.parent) hashTree(tree.parent);
    return tree;
  }

  function findNode(path) {
    var parts = path.split("/").filter(Boolean);
    var node = root;
    for (var i = 0, l = parts.length; i < l; ++i) {
      if (node.mode) return null;
      node = node.entries[parts[i]];
      if (!node) return null;
    }
    return node;
  }

  function makeNode(path, newNode) {
    var parts = path.split("/").filter(Boolean);
    var node = root;
    var last = parts.length - 1;
    var part;
    for (var i = 0; i < last; ++i) {
      var parent = node;
      var entries = node.entries;
      part = parts[i];
      node = entries[part];
      if (!node) {
        entries[part] = node = makeTree();
        node.parent = parent;
      }
      else if (node.mode) {
        throw new Error("Not a dir: " + parts.slice(0, i).join("/"));
      }
    }
    node.entries[parts[last]] = newNode;
    newNode.parent = node;
    hashTree(node);
    return newNode;
  }

  function removeNode(path, node) {
    var parts = path.split("/").filter(Boolean);
    var name = parts[parts.length - 1];
    var parent = node.parent;
    delete parent.entries[name];
    hashTree(parent);
  }

  function cloneNode(node) {
    var clone = Object.create(null);
    if (node.mode) {
      clone.data = node.data;
      clone.mode = node.mode;
    }
    else {
      var entries = clone.entries = Object.create(null);
      Object.keys(node.entries).forEach(function (name) {
        entries[name] = cloneNode(node.entries[name]);
      });
    }
    clone.hash = node.hash;
    clone.parent = node.parent;
    return clone;
  }

  var fs = {
    // (path) -> array of names (or null)
    readdir: function* (path) {
      var node = findNode(path);
      if (!node) return node;
      if (node.mode) throw new Error("Not a dir: " + path);
      return Object.keys(node.entries);
    },
    // (path) -> data (or null)
    readfile: function* (path) {
      var node = findNode(path);
      if (!node) return node;
      if (node.mode == "file" || node.mode == "exec") return node.data;
      throw new Error("Not a file: " + path);
    },
    // (path) -> { size, mode, etag }
    stat: function* (path) {
      var node = findNode(path);
      if (!node) return node;
      var type, size;
      if (node.mode) {
        type = node.mode;
        size = node.data.length;
      }
      else {
        type = "dir";
        size = Object.keys(node.entries).length;
      }
      var stat = Object.create(null);
      stat.type = type;
      stat.hash = node.hash;
      stat.size = size;
      return stat;
    },
    // (path)
    mkdir: function* (path) {
      makeNode(path, makeTree());
    },
    // (path, data, mode) -> etag
    mkfile: function* (path, data, exec) {
      makeNode(path, makeEntry(data, exec ? "exec" : "file"));
    },
    // (path, target)
    symlink: function* (path, target) {
      makeNode(path, makeEntry(target, "sym"));
    },
    // (path)
    rmfile: function* (path) {
      var node = findNode(path);
      if (!node) return false;
      if (!node.mode) throw new Error("Not a file: " + path);
      removeNode(path, node);
      return true;
    },
    // (path)
    rmdir: function* (path) {
      var node = findNode(path);
      if (!node) return false;
      if (node.mode) throw new Error("Not a dir: " + path);
      removeNode(path, node);
      return true;
    },
    // (oldPath, newPath)
    rename: function* (oldPath, newPath) {
      var node = findNode(oldPath);
      if (!node) throw new Error("No such entry: " + oldPath);
      removeNode(oldPath, node);
      makeNode(newPath, node);
    },
    // (oldPath, newPath)
    copy: function* (oldPath, newPath) {
      var node = findNode(oldPath);
      if (!node) throw new Error("No such entry: " + oldPath);
      makeNode(newPath, cloneNode(node));
    },
  };

  return {
    enable: enable,
    disable: disable,
  };

  function* enable() {
    delete menu[enableCommand];
    menu[disableCommand] = disable;
    vfs.mount("tmp", fs);
    root = makeTree();
    fs.root = root;
    return fs;
  }

  function* disable() {
    menu[enableCommand] = enable;
    delete menu[disableCommand];
    vfs.umount("tmp");
    root = null;
  }


});


