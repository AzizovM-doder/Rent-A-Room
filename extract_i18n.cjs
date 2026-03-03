const fs = require('fs');
const path = require('path');

const walk = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walk(filePath, fileList);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            fileList.push(filePath);
        }
    }
    return fileList;
};

const srcDir = path.join(__dirname, 'src');
const files = walk(srcDir);
const newKeys = {};

const regex = /t\(\s*["']([^"']+)["']\s*,\s*(["'])(.*?)\2/g;
const regex2 = /t\(\s*["']([^"']+)["']\s*,\s*\{[\s\S]*?defaultValue:\s*`([^`]+)`/g;
const regex3 = /t\(\s*["']([^"']+)["']\s*,\s*\{[\s\S]*?defaultValue:\s*(["'])(.*?)\2/g;

for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = regex.exec(content)) !== null) {
        newKeys[match[1]] = match[3];
    }
    while ((match = regex2.exec(content)) !== null) {
        newKeys[match[1]] = match[2];
    }
    while ((match = regex3.exec(content)) !== null) {
        newKeys[match[1]] = match[3];
    }
}

console.log('Found', Object.keys(newKeys).length, 'keys in source files.');

const mergeKeys = (langPath, langObj, extractedKeys, isFallback) => {
    let added = 0;
    for (const [keyPath, defaultVal] of Object.entries(extractedKeys)) {
        const parts = keyPath.split('.');
        let current = langObj;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) current[parts[i]] = {};
            current = current[parts[i]];
        }
        const lastPart = parts[parts.length - 1];
        if (current[lastPart] === undefined) {
            // No prefix so application continues to work visibly without ugly text.
            current[lastPart] = defaultVal;
            added++;
        }
    }
    fs.writeFileSync(langPath, JSON.stringify(langObj, null, 2));
    console.log('Added', added, 'missing keys to', path.basename(path.dirname(langPath)));
};

const localesDir = path.join(__dirname, 'public', 'locales');
for (const lang of ['en', 'ru', 'tj']) {
    const langPath = path.join(localesDir, lang, 'translation.json');
    if (fs.existsSync(langPath)) {
        const langObj = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
        mergeKeys(langPath, langObj, newKeys, lang !== 'en');
    }
}
