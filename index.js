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

    return result;
  }

  return null;
}

module.exports = checkText;
