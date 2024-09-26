"use strict"
const fs = require('fs')

type ParsedWord = [
  number,
  string,
  string[],
  string[],
  string[],
  string[],
  number[],
  string[],
  string,
  string,
  string,
  string
];

function wordParser(word: string): ParsedWord {
  const [
    id,
    entryForm,
    rawWordClasses,
    linzi,
    rawMeanings,
    rawRelatives,
    rawRelIDs,
    rawRelTags,
    doublets,
    relativeLip,
    example,
    comment
  ] = word.split('\t');
  return [
    Number(id),
    entryForm,
    rawWordClasses.split("；"),
    linzi.split("；"),
    rawMeanings.split("；"),
    rawRelatives.split(", "),
    rawRelIDs.split(", ").map(e => Number(e)),
    rawRelTags.split("；"),
    doublets,
    relativeLip,
    example.split("；").join("\n"),
    comment
  ]
}

const wordsWithError: string[] = [];
const wordsWithWarning: string[] = [];

const lines: string[] = fs.readFileSync('../dict.txt', 'utf-8').split(/\r\n|\n/);
// lines[0] はカラムの名前なので読んでしまうと ERROR になる
const words = lines.slice(1).map(word => {
  const [
    id,
    entryForm,
    wordClasses,
    linzi,
    meanings,
    relatives,
    relIDs,
    relTags,
    doublets,
    relativeLip,
    example,
    comment
  ] = wordParser(word);

  const entry = {
    "id": id,
    "form": entryForm
  }
  if (id <= 0 || Number.isNaN(id) || entryForm === "") {
    wordsWithError.push(`| ERROR: ${entryForm}'s ID and/or entryForm is empty\n| ${id} ${entryForm}`);
  }
  const translations = [];
  if (wordClasses.length !== meanings.length) {
    wordsWithError.push(`| ERROR: ${entryForm}'s meanings are ill-formed\n| [${wordClasses}] [${meanings}]`);
  } else if (wordClasses.some(e => e === "") || meanings.some(e => e === "")) {
    wordsWithWarning.push(`| WARNING: ${entryForm} has an empty property\n| [${wordClasses}] [${meanings}]`);
  } else {
    for (let i = 0; i < wordClasses.length; i++) {
      translations.push({
        "title": wordClasses[i],
        "forms": meanings[i].split("、")
      })
    }
  }
  if (linzi.length > 1 && linzi.includes("")) {
    wordsWithWarning.push(`| WARNING: ${entryForm} has an empty item in linzi\n| ${linzi}`)
  } else {
    translations.push({
      "title": "燐字",
      "forms": linzi
    })
  }

  const tags: string[] = [];
  const variations: string[] = [];
  const contents = [];
  if (doublets !== "") {
    contents.push({
      "title": "同根語",
      "text": doublets
    })
  }
  if (relativeLip !== "") {
    contents.push({
      "title": "関連する理語",
      "text": relativeLip
    })
  }
  if (example !== "") {
    contents.push({
      "title": "例文",
      "text": example
    })
  }
  if (comment !== "") {
    contents.push({
      "title": "備考",
      "text": comment
    })
  }

  const relations = [];
  if (relatives[0] !== "") {
    if (
      relatives.length !== relIDs.length || relIDs.length !== relTags.length ||
      relatives.some(e => e === "") || relIDs.some(e => e === 0 || Number.isNaN(e))
    ) {
      wordsWithError.push(`| ERROR: ${entryForm}'s relations are ill-formed\n| [${relatives}] [${relIDs}] [${relTags}]`);
    } else if (relTags.some(e => e === "")) {
      wordsWithWarning.push(`| WARNING: ${entryForm} has an empty property\n| [${relatives}] [${relIDs}] [${relTags}]`)
    } else {
      for (let i = 0; i < relatives.length; i++) {
        relations.push({
          "title": relTags[i],
          "entry": {
            "id": relIDs[i],
            "form": relatives[i]
          }
        })
      }
    }
  }
  return {
    "entry": entry,
    "translations": translations,
    "tags": tags,
    "contents": contents,
    "variations": variations,
    "relations": relations
  }
});
if (wordsWithError.length > 0) {
  wordsWithError.forEach(element => console.log(element))
  throw new Error("entry is ill-formed")
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
