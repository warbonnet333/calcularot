import React, {ReactElement} from "react";
import User from "../User/User";
import {memo} from "react";
import {TTransaction, TUser} from "../../types";
import {v4 as uuid} from "uuid";

type ListProps = {
    list: TUser[];
    addTransaction: (userId:string, transaction: TTransaction) => void;
    removeTransaction: (userId:string, transactionId: string) => void;
    allowEditing: boolean;
};

function List({list, addTransaction, removeTransaction, allowEditing}: ListProps): ReactElement | null {
    return (
        !!list.length ?
            <ol className="list wrapper main-list">
                {list.map((user: TUser) => (
                    <User
                        key={user.id + uuid()}
                        user={user}
                        allUsers={list}
                        addTransaction={(transaction:TTransaction) => addTransaction(user.id, transaction)}
                        removeTransaction={(transactionId:string) => removeTransaction(user.id, transactionId)}
                        allowEditing={allowEditing}
                    />
                ))}
            </ol> : null
    );
}

export default memo(List);
