import React from "react";
import Person from "../Person/Person";
import {v4 as uuid} from "uuid";
import {memo} from 'react';

const List = ({list, updateItem}) => {
    return (
        !!list.length &&
        <>
            <div className='ready_text'>Drunkards: {list.length}</div>
            <ul className='list'>
                {list.map(item =>
                    <Person
                        key={uuid()}
                        data={item}
                        items={list}
                        updateItem={updateItem}
                    />
                )}
            </ul>
        </>
    )
}

export default memo(List);