"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs"));
const indices = [
    "a", "b", "c", "d", "e", "f", "g", "h", "h^",
    "i", "j", "k", "kh", "l", "m", "n", "ng", "o",
    "p", "ph", "q", "r", "s", "s^", "sh", "t", "t^",
    "th", "u", "v", "w", "x", "y", "z"
];
const getWord = (word) => {
    const html_element_id = `${word.entry.form.split(" ").join("_")}`;
    const word_form = `<div><div class="word_form">${word.entry.form}</div><div class="tags">${word.tags.map(a => '<span class="bordered_info">' + a + '</span>').join("")}</div><a id="permalink_${html_element_id}" href="#${html_element_id}" class="permalink">¶</a></div>`;
    const translations = `<div class="word_infos">${word.translations.map(t => '<p class="word_info"><span class="bordered_info">' + t.title + '</span>' + t.forms.join(", ") + '</p>').join("")}</div>`;
    const contents = word.contents.map(({ title, text }) => '<div class="word_infos"><p class="word_info"><span class="nonbordered_info">' + title + '</span>' + text + '</p></div>').join("");
    const relations = `<div class="word_infos">${word.relations.map(({ title, entry }) => '<p class="word_info">→<span class="bordered_info">' + title + '</span><a href="#id' + entry.id + '_' + entry.form + '">' + entry.form + '</a></p>').join("")}</div>`;
    return `<div class="word" id="${html_element_id}" onmouseover="document.getElementById('permalink_${html_element_id}').style.visibility = 'visible'" onmouseout="document.getElementById('permalink_${html_element_id}').style.visibility = 'hidden'">${word_form + translations + contents + relations}</div>\n`;
};
indices.forEach((index) => {
    const file = fs.readFileSync(`./json/ail_${index}.json`, "utf-8");
    const content = JSON.parse(file);
    var text = `<html><head><link rel="stylesheet" href="./main.css"/></head><body>\n<div class="outer">\n<div class="title">${index}</div>\n`;
    content["words"].forEach((word) => {
        text += getWord(word);
    });
    text += "</div>\n</body></html>";
    fs.writeFile(`./dict/ail_${index}.html`, text, () => { });
});
var indexPage = `<html><head><link rel="stylesheet" href="./main.css"></head><body>\n<div class="outer">\n<div class="title">Air Stale Dict</div>\n<ul>\n`;
indices.forEach((index) => {
    indexPage += `<li><a href="ail_${index}.html">${index}</a></li>\n`;
});
indexPage += "</ul>\n</body>\n</html>";
fs.writeFile(`./dict/index.html`, indexPage, () => { });
