"use strict"
import fs from 'node:fs';
import compose from './compose.ts';
import validateID from './validateIDs.ts';
import validateRelID from './validateRelID.ts';

const lines: string[] = fs.readFileSync('../dict.txt', 'utf-8').split(/\r\n|\n/);
// lines[0] はカラムの名前なので読んでしまうと ERROR になる
const [words, wordsWithError, wordsWithWarning] =  compose(lines.slice(1));

if (wordsWithError.length > 0) {
  wordsWithError.forEach(element => console.log(element))
  throw new Error("entry is ill-formed")
} else {
  console.log(`OK: all entries are well-formed\n`)
}

const duplicateIds = validateID(Array.from(words, word => word.entry.id))
if (duplicateIds.length > 0) {
  console.log("| Error: Duplicate IDs found")
  duplicateIds.forEach(id => console.log(`| ${id}`))
  throw new Error('duplicate IDs')
} else {
  console.log(`OK: no duplicate IDs found\n`)
}

const wordsWithWrongRelID = validateRelID(words)
if (wordsWithWrongRelID.length > 0) {
  wordsWithWrongRelID.forEach(([id, form, relID, relForm]) => {
    console.log(`| Error: RelID of ${form} (ID: ${id}) is not designated properly\n| ${relForm} (designated RelID: ${relID})`)
  })
  throw new Error("wrong RelID")
} else {
  console.log(`OK: no wrong relIDs found\n`)
}

if (wordsWithWarning.length > 0) {
  wordsWithWarning.forEach(element => console.log(element))
}

fs.writeFileSync('../ail.json', `{
  "words": ${JSON.stringify(words, null, 2)},
  "zpdic" : {
    "alphabetOrder" : "",
    "wordOrderType" : "UNICODE",
    "punctuations" : [ ",", "、" ],
    "ignoredTranslationRegex" : "",
    "pronunciationTitle" : null,
    "plainInformationTitles" : [ ],
    "informationTitleOrder" : null,
    "formFontFamily" : null,
    "defaultWord" : {
      "entry" : {
        "id" : -1,
        "form" : ""
      },
      "translations" : [ ],
      "tags" : [ ],
      "contents" : [ ],
      "variations" : [ ],
      "relations" : [ ]
    }
  },
  "snoj" : null
}`)