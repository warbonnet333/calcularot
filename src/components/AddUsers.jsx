import {Component} from 'react';

const initialState = {
    user: '',
};

class AddUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: ''
        };
    }

    onSubmit = e => {
        console.log(this);
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.state);
    }

    render() {
        const {user} = this.state;
        return (
            <form className='App-form' onSubmit={this.onSubmit}>
                <label htmlFor="user">
                    <input
                        name='user'
                        value={user}
                        onChange={this.onItemChange}
                        type="text"
                        placeholder='user'
                    />
                </label>
                <button type="submit">+</button>
            </form>
        )
    }
}

export default AddUsers;