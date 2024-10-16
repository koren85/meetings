import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Protocol } from '../types';

interface ProtocolListProps {
  protocols: Protocol[];
  onEdit: (protocol: Protocol) => void;
  onDelete: (id: number) => void;
}

export const ProtocolList: React.FC<ProtocolListProps> = ({ protocols, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Дата</th>
            <th className="py-3 px-6 text-left">Наименование</th>
            <th className="py-3 px-6 text-left">Номер</th>
            <th className="py-3 px-6 text-left">Секретарь</th>
            <th className="py-3 px-6 text-center">Действия</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {protocols.map((protocol) => (
            <tr key={protocol.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{protocol.date}</td>
              <td className="py-3 px-6 text-left">{protocol.name}</td>
              <td className="py-3 px-6 text-left">{protocol.number}</td>
              <td className="py-3 px-6 text-left">{protocol.secretary}</td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
                  <button 
                    className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                    onClick={() => onEdit(protocol)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                    onClick={() => onDelete(protocol.id!)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};