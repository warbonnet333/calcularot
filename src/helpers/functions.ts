// Detects if all numbers are positive or negative;
// If regSum and absSum are equal, then all numbers have the same position according to zero;
type checkABSType = {
    regSum: number;
    absSum: number;
}

export const checkABS = (numbers: number[] = []): checkABSType => {
    let regSum: number = numbers.reduce((acc = 0, item = 0) => acc + item, 0);
    regSum = Math.abs(regSum);

    const absSum: number = numbers.reduce((acc, item) => acc + Math.abs(item), 0);

    return {regSum, absSum};
};