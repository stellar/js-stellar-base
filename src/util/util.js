export const trimEnd = (str, char) => {
    while (str.endsWith(char)) {
        str = str.slice(0, -1);
    }
    return str;
}
