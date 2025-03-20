const allNumberRegex = /^\s*[\d+\-Ee]*\.?[\d+\-Ee]*\s*$/

export const isValueNumber = (val: string) => {
    return allNumberRegex.test(val)
}