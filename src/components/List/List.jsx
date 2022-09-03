import React from "react";
import Person from "../Person/Person";
import {v4 as uuid} from "uuid";
import {memo} from 'react';
import {Button} from "@mui/material";

const List = ({list, updateItem, onCalculate}) => {
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
            {
                list.length > 1 &&
                <Button
                    variant="contained"
                    fullWidth={true}
                    onClick={onCalculate}
                >
                    Calculate
                </Button>
            }
        </>
    )
}

export default memo(List);