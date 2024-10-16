import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

interface ExecutorModalProps {
  executors: string[];
  setExecutors: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
}

export const ExecutorModal: React.FC<ExecutorModalProps> = ({
  executors,
  setExecutors,
  onClose,
}) => {
  const [newExecutor, setNewExecutor] = useState('');

  // const addExecutor = () => {
  //   if (newExecutor && !executors.includes(newExecutor)) {
  //     setExecutors([...executors, newExecutor]);
  //     setNewExecutor('');
  //   }
  // };

  const addExecutor = async () => {
    try {
      if (newExecutor && !executors.includes(newExecutor)) {
        const response = await axios.post('/api/executors', { name: newExecutor });
        setExecutors([...executors, response.data.name]);  // Обновляем список исполнителей
        setNewExecutor('');  // Очищаем поле ввода
      }
    } catch (error) {
      console.error('Ошибка при добавлении исполнителя:', error);
    }
  };



  // const removeExecutor = (executor: string) => {
  //   setExecutors(executors.filter((e) => e !== executor));
  // };

  const removeExecutor = async (executor: string) => {
    try {
      // Отправляем запрос на удаление исполнителя по его имени
      await axios.delete(`/api/executors/${executor}`);

      // Обновляем список исполнителей после удаления
      setExecutors(executors.filter((e) => e !== executor));
    } catch (error) {
      console.error('Ошибка при удалении исполнителя:', error);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Управление исполнителями</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={newExecutor}
            onChange={(e) => setNewExecutor(e.target.value)}
            placeholder="Новый исполнитель"
          />
          <button
            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
            onClick={addExecutor}
          >
            Добавить исполнителя
          </button>
        </div>
        <ul>
          {executors.map((executor, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                {executor.name ? executor.name : executor} {/* Убедитесь, что рендерите строку, а не объект */}
                <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeExecutor(executor)}
                >
                  <X size={20}/>
                </button>
              </li>
          ))}
        </ul>
      </div>
    </div>
  );
};