const fs = require('fs');

function sqlToObject(sqlString) {
  const regExp = /\(([^)]+)\)/g;
  const matches = [...sqlString.match(regExp)];
  const returnVar = [];
  let count = 1;
  for (let [index, value] of matches.entries()) {
    value = value.replace(')', '');
    value = value.replace('(', '');
    matches[index] = value;
  }

  for (let i = 0; i < matches.length; i += 2) {
    let columnName = matches[i];
    let value = matches[i + 1];
    let columnNameArray = columnName.split(',');
    let valueArray = value.split(',');

    let str = `const obj${count} = { \n`;
    columnNameArray.forEach((v, index) => {
      str += `${v} : ${valueArray[index]}, \n`;
    });
    str += `} \n`;
    console.log(str);
    returnVar.push(`obj${count}`);
    count++;
  }
  console.log(`return [${returnVar.join(',')}];`);
}

let stringHolder = fs.readFileSync('./src/Sql2Object/sql.txt').toString();
sqlToObject(stringHolder);
