import React, {ChangeEvent, FormEvent, useState} from 'react';
import {memo} from 'react';
import {TUser} from '../../types';
import {v4 as uuid} from "uuid";

type UserProps = {
    data: TUser;
    users?: TUser[];
    updateUser: (user: TUser) => void;
    allowEditing: boolean;
};

const ERRORS = {
    EMPTY_SPENT: 'Write how much you spent',
    EMPTY_MEMBERS: 'Choose to whom this amount will be divided',
    NOT_ONLY_YOU: 'Choose someone else besides yourself'
}

function User({data, users = [], updateUser, allowEditing}: UserProps) {
    const [isEditable, setEditable] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [spent, setSpentChange] = useState('');
    const [members, setSpentMembers] = useState([data.name]);
    const onEditClick = (): void => {
        setEditable(!isEditable);
    };
    const onSpentChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSpentChange(e.currentTarget.value);
    };

    const checkOnErrors = (): boolean => {
        if (!spent) {
            setError(ERRORS.EMPTY_SPENT);
            return true;
        }

        if (!members.length) {
            setError(ERRORS.EMPTY_MEMBERS);
            return true;
        }

        if (members.length === 1 && members[0] === data.name) {
            setError(ERRORS.NOT_ONLY_YOU);
            return true;
        }

        return false;
    }

    const onSpentSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (checkOnErrors()) {
            return;
        }

        updateUser({
            ...data,
            spent: +spent,
            members,
        });

        setError(null);
        setEditable(false);
        setSpentChange('');
        setSpentMembers([]);
    };

    const onMemberToggle = (name: string): void => {
        const ind = members.indexOf(name);
        if (ind === -1) {
            setSpentMembers([...members, name]);
            return;
        }

        const newMembers = [...members];
        newMembers.splice(ind, 1);
        setSpentMembers(newMembers);
    };

    return (
        <li className="list_item wrapper">
            <div className="d-flex f-space">
                <div className="list_item--top">{data.name}</div>
                <button className="edit_btn" disabled={!allowEditing} onClick={onEditClick}>
                    {isEditable ? 'Close' : 'Edit'}
                </button>
            </div>

            {isEditable && <form className="spent-form" onSubmit={onSpentSubmit}>
                <div className="d-flex">
                    <input
                        placeholder="Amount spent"
                        value={spent}
                        onChange={onSpentChange}
                        name="spent"
                        type="number"
                    />
                    <button type="submit" className="spent-form__btn">Add</button>
                </div>

                {error && <div className="error">{error}</div>}

                <div className="person-list d-flex">
                    <p>Divide for:</p>
                    {users?.length ? users.map((item: TUser, i: number) => (
                        <div
                            key={uuid() + i}
                            onClick={() => onMemberToggle(item.name)}
                            className={`person-list--item${members.includes(item.name) ? ' active' : ''}`}
                        >
                            {item.name}
                        </div>
                    )) : null}
                </div>
            </form>}

            {data.transactions.length ? <div className="list_item--debt wrapper">
                {data.transactions.map((transaction, i: number) => (
                    <div className="list_item--debt_item" key={transaction.id + i}>
                        <div className="debt-money">{transaction.money}</div>
                        <div className="debt-list">
                            {transaction.dividedFor.join(', ')}
                        </div>
                    </div>
                ))}
            </div> : null}
        </li>
    );
}

export default memo(User);
