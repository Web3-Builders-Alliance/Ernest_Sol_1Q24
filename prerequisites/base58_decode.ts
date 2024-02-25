import bs58 from 'bs58'

const address = '49VBjzBMc9AV6EVUjxiusZ4oR3uPNsHH36a4BGZMjENwN8wN84GiCKzetiDJstr6X8w4YHVNNP4ogeAArQPFScDR'
const decoded = bs58.decode(address)

console.log(JSON.stringify(Array.from(decoded)))