const fs = require('fs')

// recursion for concentrate
// return object { value : string , skip: number}
function concentrateArray(value, array, index, skip) {
  skip += 1
  value += `,${array[index + 1]}`
  console.log(skip)
  console.log(value)
  if (value.indexOf(']') > 0) {
    return { skip, value }
  } else {
    return concentrateArray(value, array, index + 1, skip)
  }
}

function sqlToObject(sqlString) {
  const regExp = /\(([^)]+)\)/g
  const matches = [...sqlString.match(regExp)]
  const returnVar = []
  let count = 1
  for (let [index, value] of matches.entries()) {
    value = value.replace(')', '')
    value = value.replace('(', '')
    matches[index] = value
  }

  for (let i = 0; i < matches.length; i += 2) {
    let columnName = matches[i]
    let value = matches[i + 1]
    let columnNameArray = columnName.split(',')
    let valueArray = value.split(',')
    let skip = 0
    let str = `const obj${count} = { \n`
    // get columnName and value
    columnNameArray.forEach((key, index) => {
      index = index + skip
      let value = valueArray[index]

      // null handle
      if (value.indexOf('[') > 0) {
        concentrateObject = concentrateArray(value, valueArray, index, skip)
        value = concentrateObject.value
        skip = concentrateObject.skip
      }
      if (value.indexOf('NULL') > 0) {
        value = `'NULL'`
      }
      str += `${key} : ${value}, \n`
    })
    str += `} \n`
    console.log(str)
    returnVar.push(`obj${count}`)
    count++
  }
  console.log(`return [${returnVar.join(',')}];`)
}

let stringHolder = fs.readFileSync('./src/Sql2Object/sql.txt').toString()
sqlToObject(stringHolder)
