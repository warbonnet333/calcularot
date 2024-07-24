import React, {useEffect, useState} from 'react';
import AddUsers from './components/AddUsers/AddUsers';
import List from './components/List/List';
import Result from './components/Result/Result';
import {checkABS, fixABS} from './helpers/functions';
import {TTransaction, TUser, TDebt} from "./types";


function App() {
    const [list, setList] = useState<TUser[]>([]);
    const [allowEditing, setAllowEditing] = useState<boolean>(true);

    const onAddNewUser = (item: TUser): void => setList(list => [...list, item]);

    const onAddTransaction = (userId: string, newTransaction: TTransaction): void => {
        const newList: TUser[] = [...list];

        const userToUpdateIndex: number = newList.findIndex((item: TUser): boolean => item.id === userId);
        const userToUpdate: TUser | undefined = newList[userToUpdateIndex];

        if (!userToUpdate) {
            return;
        }

        const updatedUser = {
            ...userToUpdate,
            transactions: [...userToUpdate.transactions, newTransaction]
        }

        newList.splice(userToUpdateIndex, 1, updatedUser);
        setList(newList);
    };

    const fillDebts = (): void => {
        const allUsers = [...list];

        allUsers.forEach((user: TUser, index: number): void => {
            const {name, transactions, debt} = user;
            const userDebt: TDebt = {...debt};

            transactions.forEach((transaction: TTransaction): void => {
                const {dividedFor: participantList, money} = transaction;
                const debtValue: number = +(money / participantList.length).toFixed(2);

                participantList.forEach((participantName: string): void => {
                    if (participantName === name) {
                        return
                    }

                    userDebt[participantName] = userDebt[participantName]
                        ? userDebt[participantName] + debtValue
                        : debtValue;

                    const participantIndex: number = allUsers.findIndex((item: TUser): boolean => item.name === participantName);
                    const participant: TUser = allUsers[participantIndex];
                    const {debt: participantDebt} = participant;
                    const newParticipantDebt: TDebt = {...participantDebt};

                    newParticipantDebt[name] = newParticipantDebt[name]
                        ? newParticipantDebt[name] - debtValue
                        : -debtValue;

                    const updatedParticipant: TUser = {
                        ...participant,
                        debt: newParticipantDebt
                    }

                    allUsers.splice(participantIndex, 1, updatedParticipant);
                });
            });

            const updatedUser: TUser = {...user, debt: userDebt};
            allUsers.splice(index, 1, updatedUser);
        })

        setList(allUsers);
    }

    const calculateDebts = () => {
        const allUsers: TUser[] = [...list];

        for (let i: number = 0; i < allUsers.length; i++) {
            const numbersToCheck: number[] = Object.values(allUsers[i].debt);
            const {regSum, absSum} = checkABS(numbersToCheck);

            if (regSum !== absSum) {
                fixABS(allUsers, allUsers[i]);
                calculateDebts();
                return;
            }
        }

        setList(allUsers);
    };

    const calculateResults = () => {
        const isTransactionsAdded: boolean = list.some((user: TUser): boolean => user.transactions.length > 0)
        isTransactionsAdded && fillDebts();
    }

    useEffect(() => {
        const isDebtFilled = list.some((user: TUser): boolean => Object.keys(user.debt).length !== 0);

        if (allowEditing && isDebtFilled) {
            // final calculation after filling debts
            setAllowEditing(false);
            calculateDebts();
        }
    }, [allowEditing, list]);

    const onRemoveTransaction = (userId: string, transactionId: string): void => {
        const newList: TUser[] = [...list];
        const userToUpdateIndex: number = list.findIndex((item: TUser): boolean => item.id === userId);
        const userToUpdate: TUser | undefined = list[userToUpdateIndex];

        if (!userToUpdate) {
            return;
        }

        const newTransactions: TTransaction[] = userToUpdate.transactions.filter((transaction: TTransaction) => transaction.id !== transactionId);

        const updatedUser: TUser = {
            ...userToUpdate,
            transactions: newTransactions
        }

        newList.splice(userToUpdateIndex, 1, updatedUser);
        setList(newList);
    }

    return (
        <div className="App">
            <div>
                <h1>PARTY CALCULATOR</h1>
                <div className="wrap">
                    <div className="d-six">
                        <AddUsers
                            userList={list}
                            addNewUser={onAddNewUser}
                            allowEditing={allowEditing}
                        />

                        <List
                            list={list}
                            addTransaction={onAddTransaction}
                            removeTransaction={onRemoveTransaction}
                            allowEditing={allowEditing}
                        />
                    </div>

                    <div className="d-six">
                        <Result
                            list={list}
                            onCalculate={calculateResults}
                            allowEditing={allowEditing}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
