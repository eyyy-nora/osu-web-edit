module.exports = {
  name: "owo",
  inputDir: './icons', // (required)
  outputDir: './public/build', // (required)
  fontTypes: ['eot', 'svg', 'ttf', 'woff', 'woff2'],
  assetTypes: ['ts', 'css', 'html'],
  fontsUrl: '',
  descent: 0,
  normalize: true,
  formatOptions: {
    // Pass options directly to `svgicons2svgfont`
    svg: { ascent: 0 },
    json: { indent: 2 },
    ts: { types: ['constant', 'literalId'], }
  },
  pathOptions: {
    ts: './src/icons.ts'
  }
};
