const voc1 = require('./vocabulary/eng/oxford.json');
const voc2 = require('./vocabulary/eng/cefrj.json');

const vocabulary = [...voc1, ...voc2];

// function punctuationLess(text) {
//   return text.replace(/[^\w\s\']|_/g, '').replace(/\s+/g, ' ');
// }

function objectWithCount(mainObj, objName, key) {
  const obj = mainObj[objName] ? mainObj[objName] : (mainObj[objName] = {});
  obj[key] ? obj[key]++ : (obj[key] = 1);
}

function checkText(text, voc = vocabulary) {
  const words = text.split(' ');

  const wordsFound = words.map((word) => {
    const idx = vocabulary.findIndex((w) => w.word == word);
    return !!~idx ? vocabulary[idx] : null;
  });

  if (wordsFound.length) {
    const result = wordsFound.reduce((res, word) => {
      if (word) {
        const wordInfo = { word: word.word, pos: word.pos };
        res.words ? res.words.push(wordInfo) : (res.words = [wordInfo]);

        res.total = words.length;
        objectWithCount(res, 'grade', word.cefr);
        // objectWithCount(res, 'pos', word.pos);
      } else {
        objectWithCount(res, 'grade', 'unclassified');
      }

      return res;
    }, {});

    result.complexity = Object.keys(result.grade)
      .filter((g) => g !== 'unclassified')
      .reduce((a, b) => (result.grade[a] > result.grade[b] ? a : b));

    return result;
  }

  return null;
}

module.export = checkText;
