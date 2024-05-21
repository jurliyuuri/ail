const fs = require('fs')

const words = JSON.parse(fs.readFileSync('json/ail.json', 'utf-8'))["words"]

const texts = []

for (let i=0; i<words.length;i++){
  const ithword = words[i]
  const form = ithword["entry"]["form"]
  const text = ithword["contents"][0]["text"]
    .split(/\[.*\]/).join('')
    .split(/\{.*\}/).join('')
    .split(/【.*】/).join('')
    .split(/［.*］/).join('')
    .split(/[a-z<>=]/).join('')
    .replace(/,{1,}/, ',')
  texts.push(`${form}: ${text}`)
}

fs.writeFileSync('./stale.txt', texts.join('\n'))