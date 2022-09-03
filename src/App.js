import React, {useEffect, useState} from 'react';
import AddUsers from './components/AddUsers/AddUsers';
import List from './components/List/List';
import Header from './components/Header/Header';
import Notify from './components/Notify/Notify';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from "./styles/theme";

function App() {
    const [list, setList] = useState([])
    const addNewItem = item => setList([...list, item]);
    useEffect(() => {
        console.log('list, ', list);
    }, [list]);

    const updateItem = newItem => {
        const newList = [...list];
        const itemToEditInd = newList.findIndex(item => item.name === newItem.name);
        let debt = {...newList[itemToEditInd].debt};
        const members = [...newItem.members];
        const currDebt = +(newItem.spent / newItem.members.length).toFixed(2);
        const transaction = {
            money: newItem.spent,
            dividedFor: members
        }

        members.forEach(membersName => {
            if (membersName === newItem.name) return;

            debt[membersName] = debt[membersName]
                ? debt[membersName] + currDebt
                : currDebt;

            const memberToEditInd = newList.findIndex(item => item.name === membersName);
            let membersDebt = {...newList[memberToEditInd].debt};

            membersDebt[newItem.name] = membersDebt[newItem.name]
                ? membersDebt[newItem.name] - currDebt
                : -currDebt;

            const memberToEdit = {
                ...newList[memberToEditInd],
                debt: membersDebt,
            }

            newList.splice(memberToEditInd, 1, memberToEdit);
        })


        const itemToEdit = {
            ...newList[itemToEditInd],
            transactions: [...newList[itemToEditInd].transactions, transaction],
            debt,
            spent: newList[itemToEditInd].spent + newItem.spent,
        }

        newList.splice(itemToEditInd, 1, itemToEdit);
        setList(newList);
    };

    const checkABS = obj => {
        const regSum = Math.abs(Object.values(obj).reduce((acc, item) => acc + item, 0));
        const absSum = Object.values(obj).reduce((acc, item) => acc + (Math.abs(item)), 0);
        return {regSum, absSum};
    }

    const fixABS = ({name, debt}) => {
        let upZero = {};
        let downZero = {};
        const newDebt = {...debt};

        Object.entries(debt).forEach(([person, price]) => {
            if (price > 0) {
                upZero[person] = price;
            }
            if (price < 0) {
                downZero[person] = price;
            }
        });

        const loopLength = [Object.keys(upZero).length, Object.keys(downZero).length].sort()[0];
        const user = list.find(item => item.name === name);

        for (let i = 0; i < loopLength; i++) {
            const upZeroItem = Object.entries(upZero)[i];
            const downZeroItem = Object.entries(downZero)[i];
            const upUser = list.find(item => item.name === upZeroItem[0]);
            const downUser = list.find(item => item.name === downZeroItem[0]);

            // -> означає "винен"
            // 'up' -> 'name' 200, а 'name' -> 'down' -40
            const sum = upZeroItem[1] + downZeroItem[1];

            if (sum > 0) { // ['up', 200][1] + ['down', -40][1] = 160
                // 'up' -> 'name' 160, 'up' -> 'down' 40, 'name' -> 'down' 0
                newDebt[upZeroItem[0]] = upZeroItem[1] + downZeroItem[1];
                delete newDebt[downZeroItem[0]];

                upUser.debt[name] = upUser.debt[name] + Math.abs(+downZeroItem[1]);
                upUser.debt[downZeroItem[0]] = upUser.debt[downZeroItem[0]]
                    ? upUser.debt[downZeroItem[0]] + downZeroItem[1]
                    : downZeroItem[1];

                downUser.debt[name] = downUser.debt[name] - Math.abs(+downZeroItem[1]);
                downUser.debt[upZeroItem[0]] = downUser.debt[upZeroItem[0]]
                    ? downUser.debt[upZeroItem[0]] + Math.abs(+downZeroItem[1])
                    : Math.abs(+downZeroItem[1]);

                !upUser.debt[name] && delete upUser.debt[name];
                !downUser.debt[name] && delete downUser.debt[name];

                // 'up' -> 'name' 40, а 'name' -> 'down' -200
            } else if (sum <= 0) { // ['up', 40][1] + ['down', -200][1] = -160
                // 'up' -> 'name' 0, 'up' -> 'down' 40, 'down' -> 'name' -160
                newDebt[downZeroItem[0]] = upZeroItem[1] + downZeroItem[1];
                delete newDebt[upZeroItem[0]];

                upUser.debt[name] = upUser.debt[name] - Math.abs(+downZeroItem[1]);
                upUser.debt[downZeroItem[0]] = upUser.debt[downZeroItem[0]]
                    ? upUser.debt[downZeroItem[0]] - downZeroItem[1]
                    : downZeroItem[1];

                downUser.debt[name] = downUser.debt[name] + Math.abs(+downZeroItem[1]);
                downUser.debt[upZeroItem[0]] = downUser.debt[upZeroItem[0]]
                    ? downUser.debt[upZeroItem[0]] - Math.abs(+downZeroItem[1])
                    : Math.abs(+downZeroItem[1]);

                !upUser.debt[name] && delete upUser.debt[name];
                !downUser.debt[name] && delete downUser.debt[name];

            } else { // sum = 0
                delete newDebt[downZeroItem[0]];
                delete newDebt[upZeroItem[0]];

                // TODO: перерахувати "name"

                upUser.debt[name] = upUser.debt[name] + Math.abs(+downZeroItem[1]);
                upUser.debt[downZeroItem[0]] = upUser.debt[downZeroItem[0]]
                    ? upUser.debt[downZeroItem[0]] - downZeroItem[1]
                    : downZeroItem[1];

                downUser.debt[name] = downUser.debt[name] - Math.abs(+downZeroItem[1]);
                downUser.debt[upZeroItem[0]] = downUser.debt[upZeroItem[0]]
                    ? downUser.debt[upZeroItem[0]] - Math.abs(+downZeroItem[1])
                    : Math.abs(+downZeroItem[1]);

                !upUser.debt[name] && delete upUser.debt[name];
                !downUser.debt[name] && delete downUser.debt[name];
            }
        }

        console.log('debt', debt);
        console.log('newDebt', newDebt);
        console.log(list);
        user.debt = newDebt;
    }

    const calculateResults = () => {

        for (let i = 0; i < list.length; i++) {
            const {regSum, absSum} = checkABS(list[i].debt);

            if (regSum !== absSum) {
                console.log({regSum, absSum});
                fixABS(list[i]);
                // calculateResults();
                return;
            }
        }
    }

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Header/>
                <div className="wrap">
                    <AddUsers list={list} className='add_form' addNewItem={addNewItem}/>
                    <List list={list} onCalculate={calculateResults} updateItem={updateItem}/>
                    <Notify/>
                </div>
            </ThemeProvider>
        </div>
    );
}

export default App;
