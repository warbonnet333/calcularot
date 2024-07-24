import { TUser, TDebt } from '../types';

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

    return { regSum, absSum };
};


export const fixABS = (list: TUser[], { name, debt }: TUser): void => {
    let upZero: TDebt = {};
    let downZero: TDebt = {};
    const newDebt: TDebt = { ...debt };

    Object.entries(debt).forEach(([person, price]: [string, number]): void => {
        // const [person, price] = debtRow;
        if (price > 0) {
            upZero[person] = price;
        }
        if (price < 0) {
            downZero[person] = price;
        }
    });

    const loopLength = [
        Object.keys(upZero).length,
        Object.keys(downZero).length,
    ].sort((a, b) => a - b)[0];

    const user: TUser | undefined = list.find((item) => item.name === name);

    for (let i = 0; i < loopLength; i++) {
        const upZeroItem: [string, number] = Object.entries(upZero)[i];
        const downZeroItem: [string, number] = Object.entries(downZero)[i];
        const upUser: TUser | undefined = list.find((item: TUser): boolean => item.name === upZeroItem[0]);
        const downUser: TUser | undefined = list.find((item: TUser): boolean => item.name === downZeroItem[0]);

        // -> означає "винен"
        // 'up' -> 'name' 200, а 'name' -> 'down' -40
        const sum: number = upZeroItem[1] + downZeroItem[1];
        const diff: number = [
            Math.abs(upZeroItem[1]),
            Math.abs(downZeroItem[1])
        ].sort((a: number, b: number) => a - b)[0];

        const upUserDebt: TDebt = { ...upUser?.debt };
        const downUserDebt: TDebt = { ...downUser?.debt };

        if (sum > 0) {
            // ['up', 200][1] + ['down', -40][1] = 160
            // 'up' -> 'name' 160, 'up' -> 'down' 40, 'name' -> 'down' 0
            newDebt[upZeroItem[0]] = upZeroItem[1] + downZeroItem[1];
            delete newDebt[downZeroItem[0]];

            // 'up' -> 'name' 40, а 'name' -> 'down' -200
        } else if (sum < 0) {
            // ['up', 40][1] + ['down', -200][1] = -160
            // 'up' -> 'name' 0, 'up' -> 'down' 40, 'down' -> 'name' -160
            newDebt[downZeroItem[0]] = upZeroItem[1] + downZeroItem[1];
            delete newDebt[upZeroItem[0]];
        } else {
            // sum = 0
            delete newDebt[downZeroItem[0]];
            delete newDebt[upZeroItem[0]];
        }

        upUserDebt[name] = (upUserDebt[name] || 0) + diff;
        upUserDebt[downZeroItem[0]] = (upUserDebt[downZeroItem[0]] || 0) - diff;

        downUserDebt[name] = (downUserDebt[name] || 0) - diff;
        downUserDebt[upZeroItem[0]] = (downUserDebt[upZeroItem[0]] || 0) + diff;

        !upUserDebt[name] && delete upUserDebt[name];
        !downUserDebt[name] && delete downUserDebt[name];

        if (upUser) {
            upUser.debt = { ...upUserDebt };
        }

        if (downUser) {
            downUser.debt = { ...downUserDebt };
        }
    }

    if (user) {
        user.debt = newDebt;
    }
};