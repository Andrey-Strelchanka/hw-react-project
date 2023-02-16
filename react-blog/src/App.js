import React, { useEffect, useState, Suspense } from "react";
import TodoList from "./Todo/TodoList";
import Context from "./context";
import Loader from "./Loader";
import Modal from "./Modal/Modal";

const AddTodo = React.lazy(() => import("./Todo/AddTodo"));

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://63ecdfa331ef61473b2b129f.mockapi.io/todos")
      .then((response) => response.json())
      .then((todos) => {
        setTimeout(() => {
          setTodos(todos);
          setLoading(false);
        }, 1000);
      });
  }, []);

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    );
    fetch(`https://63ecdfa331ef61473b2b129f.mockapi.io/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todos.find((todo) => todo.id === id)),
    }).then((response) => response.json());
  }

  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
    fetch(`https://63ecdfa331ef61473b2b129f.mockapi.io/todos/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todos.find((todo) => todo.id === id)),
    }).then((response) => response.json());
  }

  function addTodo(title) {
    fetch(`https://63ecdfa331ef61473b2b129f.mockapi.io/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        completed: false,
      }),
    })
      .then((response) => response.json())
      .then((todo) => {
        setTodos(todos.concat(todo));
      });
    console.log(todos);
  }

  return (
    <Context.Provider value={{ removeTodo }}>
      <div className="wrapper">
        <h1>Todo App</h1>
        <Modal />
        <Suspense fallback={<p>Loading...</p>}>
          <AddTodo onCreate={addTodo} />
        </Suspense>
        {loading && <Loader />}
        {todos.length ? (
          <TodoList todos={todos} onToggle={toggleTodo} />
        ) : loading ? null : (
          <p>No todos!</p>
        )}
      </div>
    </Context.Provider>
  );
}

export default App;
