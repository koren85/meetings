import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProtocolListPage } from './components/ProtocolListPage';
import { ProtocolTablePage } from './components/ProtocolTablePage';
import { ProtocolModal } from './components/ProtocolModal';
import { Protocol } from './types';
import * as api from './services/api';

function App() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [currentProtocol, setCurrentProtocol] = useState<Protocol | null>(null);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [executors, setExecutors] = useState<string[]>([]);

  useEffect(() => {
    fetchProtocols();
    fetchRegions();
    fetchExecutors();
  }, []);

  const fetchProtocols = async () => {
    const fetchedProtocols = await api.getAllProtocols();
    setProtocols(fetchedProtocols);
  };

  const fetchRegions = async () => {
    const fetchedRegions = await api.getAllRegions();
    setRegions(fetchedRegions);
  };

  const fetchExecutors = async () => {
    const fetchedExecutors = await api.getAllExecutors();
    setExecutors(fetchedExecutors);
  };

  const handleCreateProtocol = () => {
    setCurrentProtocol(null);
    setShowProtocolModal(true);
  };

  const handleEditProtocol = (protocol: Protocol) => {
    setCurrentProtocol(protocol);
  };

  const handleDeleteProtocol = async (id: number) => {
    const success = await api.deleteProtocol(id);
    if (success) {
      fetchProtocols();
    }
  };

  const handleSaveProtocol = async (protocol: Protocol) => {
    let savedProtocol: Protocol;
    if (protocol.id) {
      savedProtocol = await api.updateProtocol(protocol);
    } else {
      savedProtocol = await api.addProtocol(protocol);
    }
    if (savedProtocol) {
      setShowProtocolModal(false);
      fetchProtocols();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex">
        {currentProtocol ? (
          <ProtocolTablePage
            protocol={currentProtocol}
            onClose={() => setCurrentProtocol(null)}
            onSave={handleSaveProtocol}
            regions={regions}
            executors={executors}
          />
        ) : (
          <ProtocolListPage
            protocols={protocols}
            onCreateProtocol={handleCreateProtocol}
            onEditProtocol={handleEditProtocol}
            onDeleteProtocol={handleDeleteProtocol}
            regions={regions}
            setRegions={setRegions}
            executors={executors}
            setExecutors={setExecutors}
          />
        )}
      </main>
      {showProtocolModal && (
        <ProtocolModal
          protocol={currentProtocol}
          onSave={handleSaveProtocol}
          onClose={() => setShowProtocolModal(false)}
        />
      )}
    </div>
  );
}

export default App;