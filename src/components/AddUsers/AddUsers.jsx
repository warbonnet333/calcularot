import React, {Component, PureComponent} from 'react';
import st from "./AddUsers.module.css";

const initialItem = {
    name: '',
    spent: 0,
    transactions: [],
    debt: {},
};

class AddUsers extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...initialItem,
            disabled: false
        };
    }

    onSubmit = e => {
        e.preventDefault();
        const {addNewItem} = this.props;
        const {name} = this.state;
        if (!name) return
        addNewItem({
            ...initialItem,
            name
        });
        this.setState(initialItem);
    }

    onItemChange = event => {
        const target = event.target;
        const {list} = this.props;
        const disabled = list.find(item => target.value === item.name);
        console.log('list', list);
        console.log('disabled', disabled);
        console.log('target.value', target.value);

        this.setState({
            [target.name]: target.value,
            disabled: !!disabled
        });
    }

    render() {
        const {name, disabled} = this.state;
        return (
            <form onSubmit={this.onSubmit} className={st.email_form}>
                <div className={st.email_form_input}>
                    <div className={st.email_form_input_descr}>Add person</div>
                    <input className={st.email_form_small_input} name='name' required type='text'
                           placeholder="name" value={name} onChange={this.onItemChange}/>
                </div>
                <button disabled={disabled} type='submit' className={st.find_bnt}>+</button>
            </form>
        )
    }
}

export default AddUsers;