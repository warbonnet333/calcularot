import React, {Component, PureComponent} from 'react';
import st from "./AddUsers.module.css";

const initialState = {
    user: '',
};

class AddUsers extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            spent: 0,
        };
    }

    onSubmit = e => {
        e.preventDefault();
        const {addNewItem} = this.props;
        const {user} = this.state;
        if (!user) return
        addNewItem({user});
        this.setState(initialState);
    }

    onItemChange = event => {
        const target = event.target;
        this.setState({
            [target.name]: target.value,
        });
    }

    render() {
        const {user, spent} = this.state;
        return (
            <form onSubmit={this.onSubmit} className={st.email_form}>
                <div className={st.email_form_input}>
                    <div className={st.email_form_input_descr}>Add person</div>
                    <input className={st.email_form_small_input} name='user' required type='text'
                           placeholder="user" value={user} onChange={this.onItemChange}/>
                    {/*<div className={st.email_form_input_descr}>How many spent?</div>*/}
                    {/*<input className={st.email_form_small_input} name='spent' required type='number'*/}
                    {/*       placeholder="spent" value={spent} onChange={this.onItemChange}/>*/}
                </div>
                <button type='submit' className={st.find_bnt}>+</button>
            </form>
        )
    }
}

export default AddUsers;