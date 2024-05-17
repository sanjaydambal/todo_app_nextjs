"use client";
import React, { useState, useEffect } from 'react';
import Todo from './components/Todo';
import { TodoInterface, AddTodoInterface } from './models/todoInterface';

const IndexPage: React.FC = () => {
  const [todos, setTodos] = useState<TodoInterface[]>([]);
  const [newTodo, setNewTodo] = useState<AddTodoInterface>({ title: '', description: '', completed: false });
  const [isEditing, setIsEditing] = useState<number | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('http://localhost:3000/todos');
    const data = await response.json();
    setTodos(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTodo({
      ...newTodo,
      [name]: value,
    });
  };

  const addTodo = async () => {
    try {
      const response = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
      if (response.ok) {
        const data = await response.json();
        setTodos([...todos, data]);
        setNewTodo({ title: '', description: '', completed: false });
      } else {
        console.error('Failed to add todo');
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const startEditing = (todo: TodoInterface) => {
    setNewTodo(todo);
    setIsEditing(todo.id);
  };

  const updateTodo = async () => {
    if (isEditing === null) return;

    try {
      const response = await fetch(`http://localhost:3000/todos/${isEditing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
      if (response.ok) {
        const updatedTodos = todos.map(todo => todo.id === isEditing ? { ...todo, ...newTodo } : todo);
        setTodos(updatedTodos);
        setNewTodo({ title: '', description: '', completed: false });
        setIsEditing(null);
      } else {
        console.error('Failed to update todo');
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Todo App</h1>
      <div className="mb-4 flex flex-col justify-center items-center gap-2">
        <input
          type="text"
          name="title"
          value={newTodo.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="p-2 border border-gray-300 rounded w-1/3"
        />
        <textarea
          name="description"
          value={newTodo.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="p-2 border border-gray-300 rounded w-1/3"
        />
        {isEditing ? (
          <button onClick={updateTodo} className="bg-green-500 text-white px-4 py-2 rounded w-1/4">
            Update Todo
          </button>
        ) : (
          <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded w-1/4">
            Add Todo
          </button>
        )}
      </div>
      <div>
        {todos.map(todo => (
          <Todo key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} onEdit={startEditing} />
        ))}
      </div>
    </div>
  );
};

export default IndexPage;
