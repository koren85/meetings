import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';  // Добавляем импорт axios

interface RegionModalProps {
  regions: string[];
  setRegions: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
}

export const RegionModal: React.FC<RegionModalProps> = ({
  regions,
  setRegions,
  onClose,
}) => {
  const [newRegion, setNewRegion] = useState('');

  // const addRegion = () => {
  //   if (newRegion && !regions.includes(newRegion)) {
  //     setRegions([...regions, newRegion]);
  //     setNewRegion('');
  //   }
  // };
  //
  // const removeRegion = (region: string) => {
  //   setRegions(regions.filter((r) => r !== region));
  // };

  const addRegion = async () => {
    try {
      if (newRegion && !regions.includes(newRegion)) {
        const response = await axios.post('/api/regions', { name: newRegion });
        setRegions([...regions, response.data.name]);  // Обновляем список регионов
        setNewRegion('');  // Очищаем поле ввода
      }
    } catch (error) {
      console.error('Ошибка при добавлении региона:', error);
    }
  };

  const removeRegion = async (region: string) => {
    try {
      await axios.delete(`/api/regions/${region}`);
      setRegions(regions.filter((r) => r !== region));  // Удаляем регион из списка
    } catch (error) {
      console.error('Ошибка при удалении региона:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Управление регионами</h2>
          <button onClick={onClose}>
            <X size={24}/>
          </button>
        </div>
        <div className="mb-4">
          <input
              type="text"
              className="w-full p-2 border rounded"
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              placeholder="Новый регион"
          />
          <button
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
              onClick={addRegion}
          >
            Добавить регион
          </button>
        </div>
        <ul>
          {regions.map((region, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                {region}
                <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeRegion(region)}
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