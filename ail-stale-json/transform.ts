import * as fs from "node:fs";

const indices = [
    "a", "b", "c", "d", "e", "f", "g", "h", "h^",
    "i", "j", "k", "kh", "l", "m", "n", "ng", "o",
    "p", "ph", "q", "r", "s", "s^", "sh", "t", "t^",
    "th", "u", "v", "w", "x", "y", "z"
];

type Word = {
    readonly entry: {
        readonly id: number,
        readonly form: string
    },
    readonly translations: {
        readonly title: string,
        readonly forms: string[]
    }[],
    readonly tags: string[],
    readonly contents: {
        readonly title: string,
        readonly text: string
    }[],
    readonly variations: unknown[],
    readonly relations: {
        readonly title: string,
        readonly entry: {
            readonly id: number,
            readonly form: string
        }
    }[]
};

const getWord = (word: Word) => {
    const html_element_id = `${word.entry.form.split(" ").join("_")}`;

    const word_form = `<div><div class="word_form">${word.entry.form}</div><div class="tags">${word.tags.map(a => '<span class="bordered_info">' + a + '</span>').join("")
        }</div><a id="permalink_${html_element_id}" href="#${html_element_id}" class="permalink">¶</a></div>`;
    
    const translations = `<div class="word_infos">${word.translations.map(t => '<p class="word_info"><span class="bordered_info">' + t.title + '</span>' + t.forms.join(", ") + '</p>').join("")}</div>`;
    
    const contents = word.contents.map(({ title, text }) => '<div class="word_infos"><p class="word_info"><span class="nonbordered_info">' + title + '</span>' + text + '</p></div>').join("");

    const relations = `<div class="word_infos">${word.relations.map(({ title, entry}) => '<p class="word_info">→<span class="bordered_info">' + title + '</span><a href="#id' + entry.id + '_' + entry.form + '">' + entry.form + '</a></p>').join("")}</div>`;

    return `<div class="word" id="${html_element_id}" onmouseover="document.getElementById('permalink_${html_element_id}').style.visibility = 'visible'" onmouseout="document.getElementById('permalink_${html_element_id}').style.visibility = 'hidden'">${word_form + translations + contents + relations}</div>\n`;
};

indices.forEach((index) => {
    const file = fs.readFileSync(`./json/air_${index}.json`, "utf-8");
    const content = JSON.parse(file);
    var text = `<html><head><link rel="stylesheet" href="./main.css"/></head><body>\n<div class="outer">\n<div class="title">${index}</div>\n`;
    content["words"].forEach((word: Word) => {
        text += getWord(word);
    })
    text += "</div>\n</body></html>"
    fs.writeFile(`./dict/air_${index}.html`, text, () => {});
});

var indexPage = `<html><head><link rel="stylesheet" href="./main.css"></head><body>\n<div class="outer">\n<div class="title">Air Stale Dict</div>\n<ul>\n`;
indices.forEach((index) => {
    indexPage += `<li><a href="air_${index}.html">${index}</a></li>\n`;
});
indexPage += "</ul>\n</body>\n</html>";
fs.writeFile(`./dict/index.html`, indexPage, () => {});