const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      walk(path.join(dir, file), fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const files = walk('./src/app');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('alert(')) {
    // Add import if not present
    if (!content.includes("import toast")) {
      // Find the first import or 'use client'
      if (content.includes('"use client"')) {
        content = content.replace('"use client";', '"use client";\nimport toast from "react-hot-toast";');
      } else if (content.includes("'use client'")) {
        content = content.replace("'use client';", "'use client';\nimport toast from 'react-hot-toast';");
      } else {
        // Add to the top
        content = "import toast from 'react-hot-toast';\n" + content;
      }
    }

    // Replace alert( with toast( for errors
    content = content.replace(/alert\((.*?[eE]rro.*?)\)/g, 'toast.error($1)');
    // Replace alert( with toast.success( for successes
    content = content.replace(/alert\((.*?sucesso.*?)\)/g, 'toast.success($1)');
    // Replace other generic alerts
    content = content.replace(/alert\(/g, 'toast(');

    fs.writeFileSync(file, content);
    console.log("Patched " + file);
  }
}
