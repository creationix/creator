/*jshint browser:true*/

// Module system with module/load and generators
(function () {
  var modules = {};
  var waiting = {};

  this.module = module;
  this.load = load;
  this.run = run;
  load.async = loadAsync;
  load.modules = modules;
  load.strict = false;

  function module(name, definition) {
    console.log("new module", name);
    var list = waiting[name];
    if (!list && load.strict) {
      throw new Error("Module name mismatch: " + name);
    }
    modules[name] = undefined;
    run(definition, function (err, module) {
      modules[name] = module;
      if (list) {
        delete waiting[name];
        list.forEach(function (callback) {
          callback(err, module);
        });
      }
      if (err) throw err;
    });
  }

  function* load(name) {

    // If the module is already loaded, return the cached value
    if (name in modules) return modules[name];

    // If the module is already loading, wait for it to finish
    var list = waiting[name];
    if (list) {
      return yield function (callback) {
        list.push(callback);
      };
    }

    // Start a new load
    var tag = document.createElement("script");
    tag.setAttribute("src", name + ".js");
    tag.setAttribute("async", "true");
    document.head.appendChild(tag);
    var module = yield function (callback) {
      waiting[name] = [callback];
    };
    document.head.removeChild(tag);
    return module;
  }

  function loadAsync(name, callback) {
    return run(function* () {
      return yield* load(name);
    }, callback);
  }

  function run(generator, callback) {
    var iterator;
    if (typeof generator === "function") {
      // Pass in resume for no-wrap function calls
      iterator = generator(resume);
    }
    else if (typeof generator === "object") {
      // Oterwise, assume they gave us the iterator directly.
      iterator = generator;
    }
    else {
      throw new TypeError("Expected generator or iterator and got " + typeof generator);
    }

    var data = null, yielded = false;

    var next = callback ? nextSafe : nextPlain;

    next();
    check();

    function nextSafe(err, item) {
      var n;
      try {
        n = (err ? iterator.throw(err) : iterator.next(item));
        if (!n.done) {
          if (n.value) start(n.value);
          yielded = true;
          return;
        }
      }
      catch (error) {
        return callback(error);
      }
      return callback(null, n.value);
    }

    function nextPlain(err, item) {
      var cont = (err ? iterator.throw(err) : iterator.next(item)).value;
      if (cont) start(cont);
      yielded = true;
    }

    function start(cont) {
      // Pass in resume to continuables if one was yielded.
      if (typeof cont === "function") return cont(resume());
      // If an array of continuables is yielded, run in parallel
      var i, l;
      if (Array.isArray(cont)) {
        for (i = 0, l = cont.length; i < l; ++i) {
          if (typeof cont[i] !== "function") return;
        }
        return parallel(cont, resume());
      }
      // Also run hash of continuables in parallel, but name results.
      if (typeof cont === "object" && Object.getPrototypeOf(cont) === Object.prototype) {
        var keys = Object.keys(cont);
        for (i = 0, l = keys.length; i < l; ++i) {
          if (typeof cont[keys[i]] !== "function") return;
        }
        return parallelNamed(keys, cont, resume());
      }
    }

    function resume() {
      var done = false;
      return function () {
        if (done) return;
        done = true;
        data = arguments;
        check();
      };
    }

    function check() {
      while (data && yielded) {
        var err = data[0];
        var item = data[1];
        data = null;
        yielded = false;
        next(err, item);
        yielded = true;
      }
    }

  }

  function parallel(array, callback) {
    var length = array.length;
    var left = length;
    var results = new Array(length);
    var done = false;
    return array.forEach(function (cont, i) {
      cont(function (err, result) {
        if (done) return;
        if (err) {
          done = true;
          return callback(err);
        }
        results[i] = result;
        if (--left) return;
        done = true;
        return callback(null, results);
      });
    });
  }

  function parallelNamed(keys, obj, callback) {
    var length = keys.length;
    var left = length;
    var results = {};
    var done = false;
    return keys.forEach(function (key) {
      var cont = obj[key];
      results[key] = null;
      cont(function (err, result) {
        if (done) return;
        if (err) {
          done = true;
          return callback(err);
        }
        results[key] = result;
        if (--left) return;
        done = true;
        return callback(null, results);
      });
    });
  }

  if (!this.setImmediate) {
    // Polyfill setImmediate using mutation observers
    var hiddenDiv = document.createElement("div");
    var callbacks = [];
    (new MutationObserver(function() {
      var list = callbacks.slice();
      callbacks.length = 0;
      list.forEach(function(callback) { callback(); });
    })).observe(hiddenDiv, { attributes: true });

    this.setImmediate = function (callback) {
      if (!callbacks.length) {
        hiddenDiv.setAttribute('yes', 'no');
      }
      callbacks.push(callback);
    };
  }

})();

