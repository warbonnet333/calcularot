import React, { PureComponent } from "react";

const initialItem = {
  name: "",
  spent: 0,
  transactions: [],
  debt: {},
};

class AddUsers extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...initialItem,
      disabled: false,
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { addNewItem } = this.props;
    const { name } = this.state;
    if (!name) return;
    addNewItem({
      ...initialItem,
      name,
    });
    this.setState(initialItem);
  };

  onItemChange = (event) => {
    const target = event.target;
    const { list } = this.props;
    const disabled = list.find((item) => target.value === item.name);

    this.setState({
      [target.name]: target.value,
      disabled: !!disabled,
    });
  };

  render() {
    const { name, disabled } = this.state;

    return (
      <div className="wrapper d-flex add-form">
        <form className="d-flex" onSubmit={this.onSubmit}>
          <div className="d-flex">
            <input
              name="name"
              required
              type="text"
              placeholder="Person name"
              value={name}
              onChange={this.onItemChange}
            />
          </div>
          <button
            disabled={disabled}
            color="gray"
            variant="contained"
            type="submit"
          >
            Add person
          </button>
        </form>
      </div>
    );
  }
}

export default AddUsers;
