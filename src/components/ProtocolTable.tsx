import React from 'react';
import { Table } from './Table';
import { Protocol } from '../types';

interface ProtocolTableProps {
  protocol: Protocol;
  rows: any[];
  selectedRows: number[];
  onUpdateRow: (id: number, data: any) => void;
  onToggleRowSelection: (index: number) => void;
  regions: string[];
  executors: string[];
}

export const ProtocolTable: React.FC<ProtocolTableProps> = ({ 
  protocol, 
  rows,
  selectedRows,
  onUpdateRow,
  onToggleRowSelection,
  regions, 
  executors 
}) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Протокол №{protocol.number}: {protocol.name}
      </h2>
      <Table
        regions={regions}
        executors={executors}
        rows={rows}
        selectedRows={selectedRows}
        onUpdateRow={onUpdateRow}
        onToggleRowSelection={onToggleRowSelection}
      />
    </div>
  );
};