export function capitaliseString(string: String) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function randomFromArray<T>(arr: T[]) {
    if (arr.length == 0) return null;
    const arrLen = arr.length - 1;
    const indx = Math.round(arrLen * Math.random())
    return arr[indx]
}