const stubLoader = (mod, filename) => {
  mod.exports = filename;
};
[
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".bmp",
  ".ico",
  ".svg",
  ".css",
  ".scss",
  ".sass",
  ".less",
].forEach((ext) => {
  require.extensions[ext] = stubLoader;
});
