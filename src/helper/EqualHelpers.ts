// check if two nullable objects of the same type are equal using the provided comparison function
export const isEqualNullable = <T>(
    a: T | null | undefined,
    b: T | null | undefined,
    comparisonFunction: (a: T, b: T) => boolean
): boolean => {
    const compareA = a === undefined ? null : a
    const compareB = b === undefined ? null : b

    if (compareA === null && compareB === null) {
        return true;
    } else if (compareA === null || compareB === null) {
        return false;
    } else {
        return comparisonFunction(compareA, compareB);
    }
}