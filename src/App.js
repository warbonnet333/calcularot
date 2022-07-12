import './App.css';
import AddUsers from './components/AddUsers';
import UsersList from './components/UsersList';
import React, {useState} from 'react';

function App() {
    const [list, setList] = useState([])
    const addNewItem = item => {
        setList([...list, item]);
        console.log({item, list})
    };

    return (
        <div className="App">
            <header className="App-header">Hangover calculator</header>
            <AddUsers className='App-form' addNewItem={addNewItem}/>
            <UsersList list={list}/>
        </div>
    );
}

export default App;
