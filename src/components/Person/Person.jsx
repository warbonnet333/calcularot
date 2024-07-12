import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { memo } from "react";

const Person = ({ data, items = [], updateItem }) => {
  const [isEditable, setEditable] = useState(false);
  const [error, setError] = useState(null);
  const [spent, setSpentChange] = useState("");
  const [members, setSpentMembers] = useState([data.name]);
  const onEditClick = () => {
    setEditable(!isEditable);
  };
  const onSpentChange = (e) => {
    setSpentChange(e.currentTarget.value);
  };

  const onSpentSubmit = (e) => {
    e.preventDefault();
    if (!spent) {
      setError("Write how much you spent");
      return;
    }
    if (!members.length) {
      setError("Choose to whom this amount will be divided");
      return;
    }
    if (members.length === 1 && members[0] === data.name) {
      setError("Choose someone else besides yourself");
      return;
    }

    updateItem({
      ...data,
      spent: +spent,
      members,
    });
    setError(null);
    setEditable(false);
    setSpentChange('');
    setSpentMembers([]);
  };

  const onMemberToggle = (name) => {
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
        <button className="edit_btn" onClick={onEditClick}>
          {
            isEditable
              ? "Close" // <img src={icon_save} alt="Save"/>
              : "Edit" // <img src={icon_edit} alt="Edit"/>
          }
        </button>
      </div>
      {isEditable && (
        <form className="spent-form" onSubmit={onSpentSubmit}>
          <div className="d-flex">
            <input
              placeholder="Amount spent"
              value={spent}
              onChange={onSpentChange}
              name="spent"
              type="number"
            />
            <button type="submit" className="spent-form__btn">
              Add
            </button>
          </div>
          {error && <div className="error">{error}</div>}
          <div className="person-list d-flex">
            <p>Divide for:</p>
            {items.map((item) => (
              <div
                key={uuid()}
                onClick={() => onMemberToggle(item.name)}
                className={`person-list--item${
                  members.includes(item.name) ? " active" : ""
                }`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </form>
      )}
      {data.transactions.length ? (
        <div className="list_item--debt wrapper">
          {data.transactions.map((transaction) => (
            <div className="list_item--debt_item" key={uuid()}>
              <div className="debt-money">{transaction.money}</div>
              <div className="debt-list">
                {transaction.dividedFor.join(", ")}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </li>
  );
};

export default memo(Person);
