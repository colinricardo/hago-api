const fs = require('fs');

const NOUNS_FILE = 'resources/nouns.txt';
const VERBS_FILE = 'resources/verbs.txt';
const ADJECTIVES_FILE = 'resources/adjectives.txt';

const NUM_NOUNS = 1436;
const NUM_VERBS = 1043;
const NUM_ADJECTIVES = 913;

const arrayFromFile = (filepath) => {
  const data = fs.readFileSync(filepath, 'utf-8');
  return data.split('\n');
};

const getFile = (type) => {
  switch (type) {
    case 'noun':
      return arrayFromFile(NOUNS_FILE);
    case 'verb':
      return arrayFromFile(VERBS_FILE);
    case 'adjective':
      return arrayFromFile(ADJECTIVES_FILE);

    default:
      return null;
  }
};

const getWord = (type) => {
  let randomIndex;
  let data;

  switch (type) {
    case 'noun':
      randomIndex = Math.floor(Math.random() * NUM_NOUNS);
      data = getFile(type);
      return data[randomIndex];
    case 'verb':
      randomIndex = Math.floor(Math.random() * NUM_VERBS);
      data = getFile(type);
      return data[randomIndex];
    case 'adjective':
      randomIndex = Math.floor(Math.random() * NUM_ADJECTIVES);
      data = getFile(type);
      return data[randomIndex];

    default:
      return null;
  }
};

const generatePhrase = () => `${getWord('verb')}-${getWord('adjective')}-${getWord('noun')}`;

module.exports = { generatePhrase };
