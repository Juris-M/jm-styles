const fs = require("fs");
const path = require("path");

var transPath = (fn) => {
    let pth = path.join(__dirname, "..");
    if (fn) {
        return path.join(pth, fn);
    } else {
        return pth;
    }
}

for (let fn of fs.readdirSync(path.join(__dirname, ".."))) {
    if (fn.slice(0, 3) !== "jm-" || fn.slice(-4) !== ".csl") continue;

    let mtime = fs.statSync(transPath(fn)).mtimeMs;
    let date = new Date(mtime).toISOString().replace(/(?:\.[0-9]{3}Z)/, "Z");

    var txt = fs.readFileSync(transPath(fn)).toString();
    var lst = txt.split("\n");
    for (let i=0,ilen=lst.length; i<ilen; i++) {
        let line = lst[i];
        lst[i] = line.replace(/^(\s*<updated>).*(<\/updated>\s*)$/, `$1${date}$2`);
    }
    txt = lst.join("\n");
    fs.writeFileSync(transPath(fn), txt);
}

     
