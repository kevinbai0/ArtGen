export function addClassName(currentClassName: string, className: string) {
    return [...currentClassName.trim().split(" ").filter(str => str !== className), className].join(" ");
}

export function removeClassName(currentClassName: string, className: string) {
    return currentClassName.trim().split(" ").filter(str => str !== className).join(" ");
}
