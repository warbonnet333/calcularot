import React from "react";
import Person from "../Person/Person";

const List = ({list}) => {
    return (
        !!list.length &&
        <>
            <div className='ready_text'>Кількість алкашів: {list.length}</div>
            <ul className='list'>
                {list.map(item => <Person data={item}/>)}
            </ul>
        </>
    )
}

export default List;