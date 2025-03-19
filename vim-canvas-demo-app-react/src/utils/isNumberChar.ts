const specialNumberChars = ["e", "E", "+" , "-"];
const allNumberRegex = /^\s*\d*\.?\d*\s*$/

export const isValidNumberChar = (char: string) => {
    return specialNumberChars.includes(char)
}

export const isValueAllNumbers = (val: string) => {
    return allNumberRegex.test(val)
}