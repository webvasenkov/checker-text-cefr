const voc1 = require('./vocabulary/eng/oxford.json');
const voc2 = require('./vocabulary/eng/cefrj.json');

const vocabulary = [...voc1, ...voc2];

const precentage = (total, value) => Math.round((value / total) * 100);

function checkText(text, voc = vocabulary, vocName = 'Oxford Dictinoray') {
  const words = text.split(' ');
  const vocWords = [];

  // search words in vocabulary
  words.forEach((w) => {
    const foundWord = voc.find((vw) => vw.word == w);
    foundWord && vocWords.push(foundWord);
  });

  if (vocWords.length) {
    const result = {};
    result.vocName = vocName ?? '';
    result.words = vocWords;
    result.totalWords = vocWords.length;

    // grade and count every word
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

    // grade text complexity
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
      (c >= 5 && 'advanced') ||
      (b >= 15 && 'intermediate') ||
      (a >= 80 && 'beginner');

    return result;
  }

  return null;
}

module.exports = checkText;
