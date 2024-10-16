import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ProtocolList } from './ProtocolList';
import { Protocol } from '../types';
import { PlusCircle, Globe, Users } from 'lucide-react';
import { RegionModal } from './RegionModal';
import { ExecutorModal } from './ExecutorModal';

interface ProtocolListPageProps {
  protocols: Protocol[];
  onCreateProtocol: () => void;
  onEditProtocol: (protocol: Protocol) => void;
  onDeleteProtocol: (id: number) => void;
  regions: string[];
  setRegions: React.Dispatch<React.SetStateAction<string[]>>;
  executors: string[];
  setExecutors: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ProtocolListPage: React.FC<ProtocolListPageProps> = ({
  protocols,
  onCreateProtocol,
  onEditProtocol,
  onDeleteProtocol,
  regions,
  setRegions,
  executors,
  setExecutors
}) => {
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showExecutorModal, setShowExecutorModal] = useState(false);

  const sidebarButtons = [
    { icon: <PlusCircle size={24} />, onClick: onCreateProtocol, title: "Создать новый протокол" },
    { icon: <Globe size={24} />, onClick: () => setShowRegionModal(true), title: "Управление регионами" },
    { icon: <Users size={24} />, onClick: () => setShowExecutorModal(true), title: "Управление исполнителями" }
  ];

  return (
    <>
      <Sidebar buttons={sidebarButtons} />
      <div className="flex-grow bg-white shadow-md rounded-lg overflow-hidden ml-4">
        <ProtocolList 
          protocols={protocols}
          onEdit={onEditProtocol}
          onDelete={onDeleteProtocol}
        />
      </div>
      {showRegionModal && (
        <RegionModal
          // regions={regions}
            regions={regions.map(region => region.name ? region.name : region)} // Преобразование объектов в строки

            setRegions={setRegions}
          onClose={() => setShowRegionModal(false)}
        />
      )}
      {showExecutorModal && (
        <ExecutorModal
          // executors={executors}
            executors={executors.map(executor => executor.name ? executor.name : executor)} // Преобразование объектов в строки
          setExecutors={setExecutors}
          onClose={() => setShowExecutorModal(false)}
        />
      )}
    </>
  );
};