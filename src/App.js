import React, {useState} from 'react';
import AddUsers from './components/AddUsers/AddUsers';
import List from './components/List/List';
import Result from './components/Result/Result';
import {checkABS} from './helpers/functions';

function App() {
  const [list, setList] = useState([]);
  const addNewItem = (item) => setList([...list, item]);

  const updateItem = (newItem) => {
    const newList = [...list];
    const itemToEditInd = newList.findIndex(
        (item) => item.name === newItem.name
    );
    let debt = { ...newList[itemToEditInd].debt };
    const members = [...newItem.members];
    const currDebt = +(newItem.spent / newItem.members.length).toFixed(2);
    const transaction = {
      money: newItem.spent,
      dividedFor: members,
    };

    members.forEach((membersName) => {
      if (membersName === newItem.name) return;

      debt[membersName] = debt[membersName]
        ? debt[membersName] + currDebt
        : currDebt;

      const memberToEditInd = newList.findIndex(
        (item) => item.name === membersName
      );
      let membersDebt = { ...newList[memberToEditInd].debt };

      membersDebt[newItem.name] = membersDebt[newItem.name]
        ? membersDebt[newItem.name] - currDebt
        : -currDebt;

      const memberToEdit = {
        ...newList[memberToEditInd],
        debt: membersDebt,
      };

      newList.splice(memberToEditInd, 1, memberToEdit);
    });

    const itemToEdit = {
      ...newList[itemToEditInd],
      transactions: [...newList[itemToEditInd].transactions, transaction],
      debt,
      spent: newList[itemToEditInd].spent + newItem.spent,
    };

    newList.splice(itemToEditInd, 1, itemToEdit);
    setList(newList);
  };

  const fixABS = ({ name, debt }) => {
    let upZero = {};
    let downZero = {};
    const newDebt = { ...debt };

    Object.entries(debt).forEach(([person, price]) => {
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

    const user = list.find((item) => item.name === name);

    for (let i = 0; i < loopLength; i++) {
      const upZeroItem = Object.entries(upZero)[i];
      const downZeroItem = Object.entries(downZero)[i];
      const upUser = list.find((item) => item.name === upZeroItem[0]);
      const downUser = list.find((item) => item.name === downZeroItem[0]);

      // -> означає "винен"
      // 'up' -> 'name' 200, а 'name' -> 'down' -40
      const sum = upZeroItem[1] + downZeroItem[1];
      const diff = [Math.abs(upZeroItem[1]), Math.abs(downZeroItem[1])].sort(
        (a, b) => a - b
      )[0];

      const upUserDebt = { ...upUser.debt };
      const downUserDebt = { ...downUser.debt };

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
      upUser.debt = { ...upUserDebt };
      downUser.debt = { ...downUserDebt };
    }

    user.debt = newDebt;
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

    setList((list) => [...list]);
  };

  return (
    <div className="App">
      <div>
        <div className="wrap">
          <div className="d-six">
            <AddUsers
              list={list}
              className="add_form"
              addNewItem={addNewItem}
            />
            <List list={list} updateItem={updateItem} />
          </div>
          <div className="d-six">
            <Result list={list} onCalculate={calculateResults} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
