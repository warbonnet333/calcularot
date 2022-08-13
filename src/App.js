import React, {useEffect, useState} from 'react';
import AddUsers from './components/AddUsers/AddUsers';
import List from './components/List/List';
import Header from './components/Header/Header';
import Notify from './components/Notify/Notify';

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

    return (
        <div className="App">
            <Header/>
            <div className="wrap">
                <AddUsers list={list} className='add_form' addNewItem={addNewItem}/>
                <List list={list} updateItem={updateItem}/>
                <Notify/>
            </div>
        </div>
    );
}

export default App;
