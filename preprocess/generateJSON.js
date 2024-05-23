"use strict"
const fs = require('fs')

/*
lines = {
  entryForm: string; // 語形
  ID: number; // ID
  wordClasses: string[]; // 品詞
  linzi: string; // 燐字
  meanings: string[]; // 意味
  relatives: string[]; // 関連語
  relIDs: number[]; // 関連語ID
  relTags: string[]; // 関連語タグ
  doublets: string[]; // 同根語
  relativeLip: string[]; // 派生した理語
  ifLipSource: string; // リパライン語ソース
  ifUsed: string; // 用例の存在
  examples: string; // 例文
  comment: string; // 備考
}
*/

const wordsWithError = [];
const wordsWithWarning = [];

const lines = fs.readFileSync('../dict.txt', 'utf-8').split(/\r\n|\n/);
const words = lines.map(word => {
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
    ifLipSource,
    isUsed,
    example,
    comment
  ] = word.split('\t');

  const entry = {
    "id": Number(id),
    "form": entryForm
  }
  const wordClass = wordClasses.split('；');
  const meaning = meanings.split('；');
  const translations = [];
  if (wordClass.length !== meaning.length) {
    wordsWithError.push(`| ERROR: ${entryForm}'s length not match (meaning)\n| ${wordClass}, ${meaning}`);
  } else if (wordClass.some(e => e === "") || meaning.some(e => e === "")) {
    wordsWithWarning.push(`| WARNING: ${entryForm}'s wordClass is empty\n| ${wordClass}, ${meaning}`);
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
  // if (ifLipSource === "TRUE") tags.push("リパライン語ソース")
  const variations = [];
  const contents = [];
  if (doublets !== "") {
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
  if (relatives !== "") {
    const relative = relatives.split(", ");
    const relID = relIDs.split(", ");
    const relTag = relTags.split("；");
    if (
      relative.length !== relID.length || relID.length !== relTag.length ||
      relative.some(e => e === "") || relID.some(e => e === "") || relTag.some(e => e === "")
    ) {
      wordsWithError.push(`| ERROR: ${entryForm}'s length not match (relations)\n| ${relative}, ${relID}, ${relTag}`);
    } else {
      for (let i = 0; i < relative.length; i++) {
        relations.push({
          "title": relTag[i],
          "entry": {
            "id": Number(relID[i]),
            "form": relative[i]
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
