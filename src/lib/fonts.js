const FONT_DEFS = [
  { family: 'Hand1', url: '/fonts/hand1.ttf' },
  { family: 'Hand2', url: '/fonts/hand2.ttf' },
  { family: 'Hand3', url: '/fonts/hand3.ttf' },
];

export const fontsReady = Promise.all(
  FONT_DEFS.map(({ family, url }) => {
    const face = new FontFace(family, `url(${url})`);
    return face.load().then(loaded => {
      document.fonts.add(loaded);
      return loaded;
    });
  })
);
