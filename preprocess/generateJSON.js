"use strict"
const fs = require('fs')

const wordsWithError = [];

const lines = fs.readFileSync('../dict.txt', 'utf-8').split(/\r\n|\n/);
const words = [];
for (let i = 0; i < lines.length - 1; i++) {
  const [entryForm, wordClasses, linzi, meanings, relatives, doublets, relativeLip, ifLipSource, _, examples, comment] = lines[i].split('\t');

  const entry = {
    "id": i,
    "form": entryForm
  }
  const wordClass = wordClasses.split('；');
  const meaning = meanings.split('；');
  const translations = [];
  if (wordClass.length !== meaning.length) {
    wordsWithError.push(`${entryForm}: length not match`);
    translations.push({
      "title": wordClasses,
      "forms": [meanings]
    })
  } else {
    for (let i = 0; i < wordClass.length; i++) {
      translations.push({
        "title": wordClass[i],
        "forms": meaning[i].split('、')
      })
    }
  }
  if (linzi !== "") {
    translations.push({
      "title": "燐字",
      "forms": [linzi]
    })
  }
  const tags = [];
  if (ifLipSource === "TRUE") tags.push("リパライン語ソース")
  const variations = [];
  const contents = [];
  if (relatives !== "") {
    contents.push({
      "title": "関連語",
      "text": relatives
    })
  }
  if (doublets !== ""){
    contents.push({
      "title": "同根語",
      "text": doublets
    })
  }
  if (relativeLip !== "") {
    contents.push({
      "title": "派生した理語",
      "text": relativeLip
    })
  }
  if (examples !== "") {
    contents.push({
      "title": "例文",
      "text": examples
    })
  }
  if (comment !== "") {
    contents.push({
      "title": "備考",
      "text": comment
    })
  }
  const relations = [];
  words.push({
    "entry": entry,
    "translations": translations,
    "tags": tags,
    "contents": contents,
    "variations": variations,
    "relations": relations
  })
}

wordsWithError.forEach(element => console.log(element))

fs.writeFileSync('../ail.json', `{
  "words": ${JSON.stringify(words.slice(1), null, 2)},
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