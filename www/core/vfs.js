module("core/vfs", function* () {
  var filesystems = Object.create(null);

  function find(path, check) {
    var parts = path.split("/").filter(Boolean);
    var index, match;
    for (var i = 0, l = parts.length; i < l; ++i) {
      var subPath = parts.slice(0, i + 1).join("/");
      var fs = filesystems[subPath];
      if (fs) {
        match = fs;
        index = i + 1;
      }
    }
    if (!match) {
      if (!check) return;
      throw new Error("No filesystem at: " + path);
    }
    return {
      fs: match,
      path: parts.slice(index).join("/"),
    };
  }
  return {
    mounts: filesystems,
    mount: function (path, fs) {
      path = path.split("/").filter(Boolean).join("/");
      filesystems[path] = fs;
    },
    umount: function (path) {
      path = path.split("/").filter(Boolean).join("/");
      delete filesystems[path];
    },
    readdir: function* (path) {
      var match = find(path);
      if (!match) return;
      return yield* match.fs.readdir(match.path);
    },
    readfile: function* (path) {
      var match = find(path);
      if (!match) return;
      return yield* match.fs.readfile(match.path);
    },
    stat: function* (path) {
      var match = find(path);
      if (!match) return;
      return yield* match.fs.stat(match.path);
    },
    mkdir: function* (path) {
      var match = find(path, true);
      return yield* match.fs.mkdir(match.path);
    },
    mkfile: function* (path, data, exec) {
      var match = find(path, true);
      return yield* match.fs.mkfile(match.path, data, exec);
    },
    symlink: function* (path, target) {
      var match = find(path, true);
      return yield* match.fs.symlink(match.path, target);
    },
    rmfile: function* (path) {
      var match = find(path, true);
      return yield* match.fs.rmfile(match.path);
    },
    rmdir: function* (path) {
      var match = find(path, true);
      return yield* match.fs.rmdir(match.path);
    },
    rename: function* (oldPath, newPath) {
      var match1 = find(oldPath, true);
      var match2 = find(newPath, true);
      if (match1.fs === match2.fs) {
        return yield* match1.fs.rename(match1.path, match2.path);
      }
      throw new Error("TODO: Implement cross-filesystem rename");
    },
    copy: function* (oldPath, newPath) {
      var match1 = find(oldPath, true);
      var match2 = find(newPath, true);
      if (match1.fs === match2.fs) {
        return yield* match1.fs.copy(match1.path, match2.path);
      }
      throw new Error("TODO: Implement cross-filesystem copy");
    },
  };
});
