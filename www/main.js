module("main", function* () {
  console.log("Starting main");
  yield* load("plugins/fake-filesystem");
});
