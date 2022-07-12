import React from "react";
import {v4 as uuidv4} from "uuid";

const UsersList = ({list}) => {
    return (
        !!list.length &&
        <>
            <h2>Кількість алкашів: {list.length}</h2>
            <ul className='list'>
                {list.map(item => <li key={uuidv4()}>{item.user}</li>)}
            </ul>
        </>
    )
}

export default UsersList;