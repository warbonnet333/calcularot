import React, {ReactElement} from "react";
import User from "../User/User";
import {memo} from "react";
import {TUser} from "../../types";
import {v4 as uuid} from "uuid";

type ListProps = {
    list: TUser[];
    updateUser: (user: TUser) => void;
    allowEditing: boolean;
};

function List({list, updateUser, allowEditing}: ListProps): ReactElement | null {
    return (
        !!list.length ?
            <ol className="list wrapper main-list">
                {list.map((item: TUser) => (
                    <User
                        key={item.id + uuid()}
                        data={item}
                        users={list}
                        updateUser={updateUser}
                        allowEditing={allowEditing}
                    />
                ))}
            </ol> : null
    );
}

export default memo(List);
