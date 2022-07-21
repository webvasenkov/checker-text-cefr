const voc1 = require('./vocabulary/eng/oxford.json');
const voc2 = require('./vocabulary/eng/cefrj.json');

const vocabulary = [...voc1, ...voc2];

// function punctuationLess(text) {
//   return text.replace(/[^\w\s\']|_/g, '').replace(/\s+/g, ' ');
// }

const precentage = (total, value) => Math.round((value / total) * 100);

function checkText(text, voc = vocabulary) {
  const words = text.split(' ');
  const vocWords = [];

  words.forEach((w) => {
    const foundWord = voc.find((vw) => vw.word == w);
    foundWord && vocWords.push(foundWord);
  });

  if (vocWords.length) {
    const result = {};
    result.words = vocWords;
    result.totalWords = vocWords.length;

    result.grade = vocWords.reduce((res, w) => {
      const wordByCefr = res.find((g) => g.cefr == w.cefr);

      if (wordByCefr) {
        wordByCefr.count++;
        wordByCefr.precent = precentage(result.totalWords, wordByCefr.count);
      } else {
        const grade = {
          cefr: w.cefr,
          count: 1,
          precent: precentage(result.totalWords, 1),
        };
        res = [...res, grade];
      }

      return res;
    }, []);

    result.commonLevel = { a: 0, b: 0, c: 0 };

    result.grade.forEach((g) => {
      switch (g.cefr) {
        case 'a1':
        case 'a2':
          result.commonLevel.a += g.precent;
          break;
        case 'b1':
        case 'b2':
          result.commonLevel.b += g.precent;
          break;
        case 'c1':
        case 'c2':
          result.commonLevel.c += g.precent;
          break;
        default:
          break;
      }
    });

    const { a, b, c } = result.commonLevel;

    result.complexity =
      (c >= 10 && 'advanced') ||
      (b >= 20 && 'intermediate') ||
      (a >= 70 && 'begginer');

    return result;
  }

  return null;
}

module.exports = checkText;
