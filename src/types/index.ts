export type TTransaction = {
    id: string;
    money: number;
    dividedFor: string[];
};

export type TDebt = {
    [key: string]: number;
};

export type TUser = {
    id: string;
    name: string;
    spent: number;
    transactions: TTransaction[];
    debt: TDebt;
    members: string[];
};

