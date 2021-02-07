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

    let atime = fs.statSync(transPath(fn)).atime;
    let mtime = fs.statSync(transPath(fn)).mtime;
	
    let newDate = mtime.toISOString().replace(/(?:\.[0-9]{3}Z)/, "+00:00");

    var txt = fs.readFileSync(transPath(fn)).toString();
    var lst = txt.split("\n");
    for (let i=0,ilen=lst.length; i<ilen; i++) {
        var line = lst[i];
        var m = line.match(/^(\s*<updated>)(.*)(<\/updated>\s*)$/);
        if (m) {
            oldDate = m[2];
            if (oldDate !== newDate) {
                lst[i] = `${m[1]}${newDate}${m[3]}`;
                txt = lst.join("\n");
                fs.writeFileSync(transPath(fn), txt);
				fs.utimesSync(transPath(fn), atime, mtime);
                break;
            }
        }
    }
}
