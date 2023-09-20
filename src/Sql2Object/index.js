const fs = require('fs')

function sqlToObject(sqlString) {
  const regExp = /\(([^)]+)\)/g
  const matches = [...sqlString.match(regExp)]
  const returnVar = []
  let count = 1
  for (let [index, value] of matches.entries()) {
    value = value.replace(')', '')
    value = value.replace('(', '')
    if (index % 2 == 0) {
      // get rid off the ` of the key
      value = value.replaceAll('`', '')
    }
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
      // rpelace stupid `

      index = index + skip
      let value = valueArray[index]

      // iif value is array
      if (value.indexOf('[') > 0) {
        ;[concentrateObject] = concentrateWhenValueIsArray(
          value,
          valueArray,
          index,
          skip,
        )
        value = concentrateObject.value
        skip = concentrateObject.skip
      }

      // null handle
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

/*
 * when value equal array need to concentrate back
 * since the value already split by comma
 * return object { value : string , skip: number}
 */

function concentrateWhenValueIsArray(value, array, index, skip) {
  skip += 1
  value += `,${array[index + 1]}`

  if (value.indexOf(']') > 0) {
    return { skip, value }
  } else {
    // go find next value of arry
    return concentrateWhenValueIsArray(value, array, index + 1, skip)
  }
}

function main() {
  let stringHolder = fs.readFileSync('./src/Sql2Object/sql.txt').toString()
  sqlToObject(stringHolder)
}

main()
