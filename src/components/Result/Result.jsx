import React from "react";
import { v4 as uuid } from "uuid";

const Result = ({ list, onCalculate }) =>
  list.length ? (
    <div className="wrapper result-wrapper">
      <div className="d-space result-title">
        <h3>Results</h3>
        <p>
          <span className="in-come">Get</span>
          <span className="out-come">Give</span>
        </p>
        {list.length > 1 && (
          <button className="calculate-brn" onClick={onCalculate}>
            Calculate
          </button>
        )}
      </div>
      <ul className="list result-list">
        {list.map((item) => (
          <li key={uuid()}>
            <h3>{item.name}</h3>
            {Object.entries(item.debt).map(([key, value]) => (
              <div
                key={uuid()}
                className={`wrapper ${value > 0 ? "in-come" : "out-come"}`}
              >
                {key}: {value}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
export default Result;
