import React, {useState} from 'react';
import {v4 as uuidv4} from "uuid";
import icon_edit from "../../images/icon_edit.svg";
import icon_plus from "../../images/icon_plus.svg";
import icon_save from "../../images/icon_save.svg";

const Person = ({data}) => {
    const [isEditable, setEditable] = useState(false);

    return (
        <li className='list_item' key={uuidv4()}>
            <div className="list_item--top">
                <div>{data.user}</div>
            </div>
            <button className='edit_btn'>
                {
                    isEditable
                        ? <img src={icon_save} alt="Save"/>
                        : <img src={icon_edit} alt="Edit"/>
                }
            </button>
            {data.spentSum &&
                <div className="list_item--content">
                    <div className="list_item--content_debt">
                        <div className="money">{data.spent || 100}</div>
                        <ul className="debt_list">
                            <li key={uuidv4()}>Anton</li>
                            <li key={uuidv4()}>Ira</li>
                        </ul>
                        <button className='plus_btn'>
                            <img src={icon_plus} alt="Edit"/>
                        </button>
                    </div>
                </div>
            }
        </li>
    )
}

export default Person;