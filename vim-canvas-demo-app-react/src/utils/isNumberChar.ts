const allNumberRegex = /^[0-9]+$/


export const isValueNumber = (val: string) => {
    return allNumberRegex.test(val)
}