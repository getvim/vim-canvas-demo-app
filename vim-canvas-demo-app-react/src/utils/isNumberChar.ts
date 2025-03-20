const specialNumberChars = ["e", "E", "+" , "-"];
const allNumberRegex = /^\s*[\d+\-Ee]*\.?[\d+\-Ee]*\s*$/


export const isValidNumberChar = (char: string) => {
    return specialNumberChars.includes(char)
}

export const isValueAllNumbers = (val: string) => {
    return allNumberRegex.test(val)
}