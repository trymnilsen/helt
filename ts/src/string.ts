export function isBlank(value: string | string[]): boolean {
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return true;
        }
        if (value.some((item) => isBlank(item))) {
            return true;
        }
        return false;
    } else {
        return !value || typeof value !== "string" || !/\S/.test(value);
    }
}
