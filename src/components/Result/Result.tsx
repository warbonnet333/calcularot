import React, {useState} from "react";
import {v4 as uuid} from "uuid";
import {TUser} from "../../types";

type ResultProps = {
    list: TUser[];
    onCalculate: () => void;
    allowEditing: boolean;
};

const Result = ({ list, onCalculate }: ResultProps): React.JSX.Element | null => {
    const [shownType, setShownType] = useState<string>('all'); // all, in-come, out-come
    const getResultList = (list: TUser[] = []): TUser[] => {
        if (shownType === 'in-come') {
            return list.filter((item: TUser) => Object.values(item.debt)[0] > 0);
        }

        if (shownType === 'out-come') {
            return list.filter((item: TUser) => Object.values(item.debt)[0] < 0);
        }

        return list;
    }

    return list.length ?
        <div className="wrapper result-wrapper">
            <div className="d-space result-title">
                <h3>Results</h3>
                <div className='result-buttons'>
                    <button className={shownType === 'all' ? 'active' : ''} onClick={() => setShownType('all')}>All</button>
                    <button className={shownType === 'in-come' ? 'in-come active' : 'in-come'} onClick={() => setShownType('in-come')}>Income</button>
                    <button className={shownType === 'out-come' ? 'out-come active' : 'out-come'} onClick={() => setShownType('out-come')}>Outcome</button>
                </div>
                {list.length > 1 && (
                    <button className="calculate-brn" onClick={onCalculate}>
                        Calculate
                    </button>
                )}
            </div>
            <ul className="list result-list">
                {getResultList(list).map((item: TUser, i: number) => <li key={uuid() + i}>
                        <h3>{item.name}</h3>
                        {Object.entries(item.debt).map(([key, value]) => (
                            <div
                                key={uuid()}
                                className={`wrapper ${value > 0 ? "in-come" : "out-come"}`}
                            >
                                {key}: {value.toFixed(0)}
                            </div>
                        ))}
                    </li>
                )}
            </ul>
        </div> : null;
}

export default Result;
