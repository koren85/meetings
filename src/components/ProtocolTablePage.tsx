import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ProtocolTable } from './ProtocolTable';
import { Protocol } from '../types';
import { Save, ArrowLeft, FileSpreadsheet, Merge, Scissors, PlusCircle, Trash2 } from 'lucide-react';
import { exportToExcel } from '../utils/excelExport';

interface ProtocolTablePageProps {
  protocol: Protocol;
  onClose: () => void;
  onSave: (protocol: Protocol) => void;
  regions: string[];
  executors: string[];
}

export const ProtocolTablePage: React.FC<ProtocolTablePageProps> = ({
  protocol,
  onClose,
  onSave,
  regions,
  executors
}) => {
  const [rows, setRows] = useState<any[]>(protocol.rows || []);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now() }]);
  };

  const handleDeleteRows = () => {
    setRows(rows.filter((_, index) => !selectedRows.includes(index)));
    setSelectedRows([]);
  };

  const handleUpdateRow = (id: number, data: any) => {
    setRows(rows.map(row => row.id === id ? { ...row, ...data } : row));
  };

  const handleToggleRowSelection = (index: number) => {
    setSelectedRows(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSave = () => {
    const updatedProtocol = { ...protocol, rows };
    onSave(updatedProtocol);
  };

  const handleExport = () => {
    exportToExcel(rows, protocol.number);
  };

  const handleMergeRows = () => {
    if (selectedRows.length < 2) {
      alert('Выберите как минимум две строки для объединения');
      return;
    }
    
    const sortedSelectedRows = [...selectedRows].sort((a, b) => a - b);
    const firstRowIndex = sortedSelectedRows[0];
    const mergedRow = { ...rows[firstRowIndex], mergedRows: sortedSelectedRows.length };
    
    for (let i = 1; i < sortedSelectedRows.length; i++) {
      const rowIndex = sortedSelectedRows[i];
      mergedRow[`row${i}`] = rows[rowIndex];
    }
    
    const newRows = rows.filter((_, index) => !selectedRows.includes(index));
    newRows.splice(firstRowIndex, 0, mergedRow);
    
    setRows(newRows);
    setSelectedRows([]);
  };

  const handleSplitRows = () => {
    const newRows = rows.flatMap((row, index) => {
      if (selectedRows.includes(index) && row.mergedRows) {
        const splitRows = [{ ...row, mergedRows: undefined }];
        for (let i = 1; i < row.mergedRows; i++) {
          splitRows.push(row[`row${i}`] || {});
        }
        return splitRows;
      }
      return row;
    });
    
    setRows(newRows);
    setSelectedRows([]);
  };

  const sidebarButtons = [
    { icon: <Save size={24} />, onClick: handleSave, title: "Сохранить" },
    { icon: <ArrowLeft size={24} />, onClick: onClose, title: "Вернуться к списку" },
    { icon: <PlusCircle size={24} />, onClick: handleAddRow, title: "Добавить строку" },
    { icon: <Merge size={24} />, onClick: handleMergeRows, title: "Объединить строки" },
    { icon: <Scissors size={24} />, onClick: handleSplitRows, title: "Разделить строки" },
    { icon: <Trash2 size={24} />, onClick: handleDeleteRows, title: "Удалить выбранные строки" },
    { icon: <FileSpreadsheet size={24} />, onClick: handleExport, title: "Экспорт в Excel" }
  ];

  return (
    <>
      <Sidebar buttons={sidebarButtons} />
      <div className="flex-grow bg-white shadow-md rounded-lg overflow-hidden ml-4">
        <ProtocolTable 
          protocol={protocol}
          rows={rows}
          selectedRows={selectedRows}
          onUpdateRow={handleUpdateRow}
          onToggleRowSelection={handleToggleRowSelection}
          regions={regions}
          executors={executors}
        />
      </div>
    </>
  );
};