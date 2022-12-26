import React from "react";
import Person from "../Person/Person";
import { v4 as uuid } from "uuid";
import { memo } from "react";

const List = ({ list, updateItem, onCalculate }) => {
  return (
    !!list.length && (
      <ol className="list wrapper main-list">
        {list.map((item) => (
          <Person
            key={uuid()}
            data={item}
            items={list}
            updateItem={updateItem}
          />
        ))}
      </ol>
    )
  );
};

export default memo(List);
