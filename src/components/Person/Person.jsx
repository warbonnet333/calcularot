import React, {useState} from 'react';
import {v4 as uuid} from "uuid";
import {memo} from 'react';
import icon_edit from "../../images/icon_edit.svg";
import icon_save from "../../images/icon_save.svg";

const Person = ({data, items = [], updateItem}) => {
    const [isEditable, setEditable] = useState(false);
    const [error, setError] = useState(null);
    const [spent, setSpentChange] = useState('');
    const [members, setSpentMembers] = useState([data.name]);
    const onEditClick = () => {
        setEditable(!isEditable);
    }
    const onSpentChange = (e) => {
        setSpentChange(e.currentTarget.value);
    }

    const onSpentSubmit = (e) => {
        e.preventDefault();
        if (!spent) {
            setError('Введи витрачену суму');
            return;
        }
        if (!members.length) {
            setError('Вибери на кого ділити суму');
            return;
        }
        if (members.length === 1 && members[0] === data.name) {
            setError('Вибери ще когось крім себе');
            return;
        }

        updateItem({
            ...data,
            spent: +spent,
            members
        })
        setError(null);
        setEditable(false);
        setSpentChange(0);
        setSpentMembers([]);

    }

    const onMemberToggle = (name) => {
        const ind = members.indexOf(name);
        if (ind === -1) {
            setSpentMembers([...members, name])
            return;
        }
        const newMembers = [...members];
        newMembers.splice(ind, 1)
        setSpentMembers(newMembers);
    }

    return (
        <li className='list_item'>
            <div className="list_item--top">{data.name}</div>
            <button className='edit_btn' onClick={onEditClick}>
                {
                    isEditable
                        ? <img src={icon_save} alt="Save"/>
                        : <img src={icon_edit} alt="Edit"/>
                }
            </button>
            {data.transactions.length ?
                <div className='list_item--debt'>
                    {
                        data.transactions.map(transaction =>
                            <div className='list_item--debt_item' key={uuid()}>
                                <div className='debt-money'>{transaction.money}</div>
                                <div className='debt-list'>{transaction.dividedFor.join(', ')}</div>
                            </div>
                        )
                    }
                </div> : null
            }
            {
                isEditable &&
                <form className='spent-form' onSubmit={onSpentSubmit}>
                    <div className="spent-form__top">
                        <input placeholder='Сума' value={spent} onChange={onSpentChange} name="spent"
                               type="number"/>
                        <button type='submit' className='spent-form__btn'/>
                    </div>
                    {error && <div className='spent-form__top-error'>{error}</div>}
                    <div className='spent-form__members'>
                        {
                            items.map(item =>
                                <div key={uuid()}
                                     onClick={() => onMemberToggle(item.name)}
                                     className={`spent-form__members-item${members.includes(item.name) ? ' active' : ''}`}
                                >
                                    {item.name}
                                </div>
                            )
                        }
                    </div>

                </form>
            }
        </li>
    )
}

export default memo(Person);