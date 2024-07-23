import React, {ChangeEvent, FormEvent, useState} from "react";
import {v4 as uuid} from "uuid";
import {type TUser} from "../../types";

type AddUsersProps = {
    addNewUser: (item: TUser) => void;
    userList: TUser[];
    allowEditing: boolean;
};

const emptyUser: TUser = {
    id: '',
    name: '',
    spent: 0,
    transactions: [],
    debt: {},
    members: []
};

function AddUsers({addNewUser, userList, allowEditing}: AddUsersProps) {
    const [disabled, setDisabled] = useState(false);
    const [user, setUser] = useState(emptyUser);

    const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e && e.preventDefault();
        user.name && addNewUser({...user, id: uuid()});
        setUser(emptyUser);
    }

    const isUserExist = (name: string): boolean => userList.some((item) => name === item.name);

    const onChange = ({target}: ChangeEvent<HTMLInputElement>): void => {
        const {value} = target;

        setUser(prev => ({...prev, name: value}));
        setDisabled(isUserExist(value));
    }

    return (
        <div className="wrapper d-flex add-form">
            <form className="d-flex" onSubmit={(e) => onSubmit(e)}>
                <div className="d-flex">
                    <input
                        name="name"
                        required
                        type="text"
                        placeholder="User name"
                        value={user.name}
                        onChange={onChange}
                    />
                </div>
                <button
                    disabled={disabled || !allowEditing}
                    color="gray"
                    type="submit"
                >
                    Add person
                </button>
            </form>
        </div>
    );
}

export default AddUsers;
