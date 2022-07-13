import React, {useState} from 'react';
import AddUsers from './components/AddUsers/AddUsers';
import List from './components/List/List';
import Header from './components/Header/Header';
import Notify from './components/Notify/Notify';

function App() {
    const [list, setList] = useState([])
    const addNewItem = item => setList([...list, item]);

    return (
        <div className="App">
            <Header/>
            <div className="wrap">
                <AddUsers className='add_form' addNewItem={addNewItem}/>
                {/*<MainPage/>*/}
                <List list={list}/>
                <Notify/>
            </div>
        </div>
    );
}

export default App;
