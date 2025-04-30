import React, { Component } from 'react';

class Child extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      inputText: '',
    };
  }

  handleInputChange = (event) => {
    this.setState({ inputText: event.target.value });
  };

  addTodo = () => {
    this.setState({ todos: [...this.state.todos, this.state.inputText], inputText: ''});
  };

  removeToDo = (task) => {
    let filteredTask = this.state.todos.filter(item=>item!==task);
    this.setState({todos:filteredTask})
  };

  render() {
    return (
      <div style={{padding:20}}>
        <input type="text" value={this.state.inputText} onChange={this.handleInputChange} placeholder="Add a todo" />
        <button onClick={this.addTodo}>Add Todo</button>
        { this.state.todos!=null?
        <ul>
            {this.state.todos.map(item=><li>{item} <button onClick={()=>this.removeToDo(item)}>Remove</button></li>)}
        </ul>
         :null }
      </div>
    );
  }
}

export default Child;