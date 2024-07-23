import React, {useState} from 'react';
import AddUsers from './components/AddUsers/AddUsers';
import List from './components/List/List';
import Result from './components/Result/Result';
import {checkABS} from './helpers/functions';
import {TTransaction, TUser, TDebt} from "./types";


function App() {
    const [list, setList] = useState<TUser[]>([]);
    const addNewUser = (item: TUser): void => setList(list => [...list, item]);
    const [allowEditing, setAllowEditing] = useState<boolean>(true);

    const updateUser = (newItem: TUser): void => {
        const newList: TUser[] = [...list];
        const itemToEditInd: number = newList.findIndex((item: TUser): boolean => item.name === newItem.name);
        let debt: TDebt = {...newList[itemToEditInd].debt};
        const members: string[] = [...newItem.members];
        const currDebt: number = +(newItem.spent / newItem.members.length).toFixed(2);
        const transaction: TTransaction = {
            id: newItem.id,
            money: newItem.spent,
            dividedFor: members,
        };

        members.forEach((membersName: string): void => {
            if (membersName === newItem.name) return;

            debt[membersName] = debt[membersName]
                ? debt[membersName] + currDebt
                : currDebt;

            const memberToEditInd: number = newList.findIndex(
                (item: TUser): boolean => item.name === membersName
            );
            let membersDebt: TDebt = {...newList[memberToEditInd].debt};

            membersDebt[newItem.name] = membersDebt[newItem.name]
                ? membersDebt[newItem.name] - currDebt
                : -currDebt;

            const memberToEdit = {
                ...newList[memberToEditInd],
                debt: membersDebt,
            };

            newList.splice(memberToEditInd, 1, memberToEdit);
        });

        const itemToEdit: TUser = {
            ...newList[itemToEditInd],
            transactions: [...newList[itemToEditInd].transactions, transaction],
            debt,
            spent: newList[itemToEditInd].spent + newItem.spent,
        };

        newList.splice(itemToEditInd, 1, itemToEdit);
        setList(newList);
    };

    const fixABS = ({name, debt}: TUser): void => {
        let upZero: TDebt = {};
        let downZero: TDebt = {};
        const newDebt: TDebt = {...debt};

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

            const upUserDebt: TDebt = {...upUser?.debt};
            const downUserDebt: TDebt = {...downUser?.debt};

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
                upUser.debt = {...upUserDebt};
            }

            if (downUser) {
                downUser.debt = {...downUserDebt};
            }
        }

        if (user) {
            user.debt = newDebt;
        }
    };

    const calculateResults = () => {
        for (let i = 0; i < list.length; i++) {
            const numbersToCheck = Object.values(list[i].debt);
            const {regSum, absSum} = checkABS(numbersToCheck);

            if (regSum !== absSum) {
                fixABS(list[i]);
                calculateResults();
                return;
            }
        }

        setList((list: TUser[]) => [...list]);
        setAllowEditing(false);
    };

    return (
        <div className="App">
            <div>
                <div className="wrap">
                    <div className="d-six">
                        <AddUsers userList={list} addNewUser={addNewUser} allowEditing={allowEditing}/>
                        <List list={list} updateUser={updateUser} allowEditing={allowEditing}/>
                    </div>
                    <div className="d-six">
                        <Result list={list} onCalculate={calculateResults} allowEditing={allowEditing}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
