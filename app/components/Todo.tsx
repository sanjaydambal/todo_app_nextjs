import React from 'react';
import { TodoInterface } from '../models/todoInterface';

interface TodoProps {
  todo: TodoInterface;
  onUpdate: (id: number, todo: TodoInterface) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: TodoInterface) => void; 
}

const Todo: React.FC<TodoProps> = ({ todo, onUpdate, onDelete, onEdit }) => {
  const [isChecked, setIsChecked] = React.useState<boolean>(todo.completed);

  const handleCheckboxChange = () => {
    onUpdate(todo.id, { ...todo, completed: !isChecked });
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center border-b border-gray-200 py-4">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="mr-4"
      />
      <div className="flex-grow">
        <h3 className={`text-lg ${isChecked ? 'line-through' : ''}`}>{todo.title}</h3>
        <p>{todo.description}</p>
      </div>
      <div className="flex gap-2 ml-4">
        <button
          onClick={() => onEdit(todo)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Todo;
