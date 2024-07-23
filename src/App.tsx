import React, {useState} from 'react';
import AddUsers from './components/AddUsers/AddUsers';
import List from './components/List/List';
import Result from './components/Result/Result';
import {checkABS, fixABS} from './helpers/functions';
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

    const calculateResults = () => {
        for (let i = 0; i < list.length; i++) {
            const numbersToCheck = Object.values(list[i].debt);
            const {regSum, absSum} = checkABS(numbersToCheck);

            if (regSum !== absSum) {
                fixABS(list, list[i]);
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
                <h1>PARTY CALCULATOR</h1>
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
