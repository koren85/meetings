import * as XLSX from 'xlsx';

export const exportToExcel = (rows: any[], protocolNumber: number) => {
  // Определение заголовков
  const headers = [
    '№ п/п',
    'Регион',
    'Задачи',
    'Исполнитель',
    'Срок выполнения',
    'Отметка о выполнении',
    'Результат',
    'Подпись',
    'Комментарий'
  ];

  // Преобразование данных в формат для Excel
  const data = rows.flatMap((row, index) => {
    const baseRow = [
      index + 1,
      row.region || '',
      row.tasks || '',
      (row.executor || []).join(', '),
      row.dueDate || '',
      row.completionStatus || '',
      row.result || '',
      row.signature || '',
      row.comment || ''
    ];

    if (row.mergedRows && row.mergedRows > 1) {
      const additionalRows = Array.from({ length: row.mergedRows - 1 }, (_, i) => {
        const subRow = row[`row${i + 1}`] || {};
        return [
          '',
          '',
          subRow.tasks || '',
          (subRow.executor || []).join(', '),
          subRow.dueDate || '',
          subRow.completionStatus || '',
          subRow.result || '',
          subRow.signature || '',
          subRow.comment || ''
        ];
      });
      return [baseRow, ...additionalRows];
    }

    return [baseRow];
  });

  // Создание рабочей книги и листа
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    [`Протокол планёрки №${protocolNumber}`],
    [],
    headers,
    ...data
  ]);

  // Применение объединения ячеек для merged rows и заголовка
  const merges: XLSX.Range[] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, // Объединение ячеек для заголовка
  ];

  let currentRow = 3; // Начинаем с 3, так как 0 - заголовок, 1 - пустая строка, 2 - строка с названиями столбцов
  rows.forEach((row) => {
    if (row.mergedRows && row.mergedRows > 1) {
      merges.push(
        { s: { r: currentRow, c: 0 }, e: { r: currentRow + row.mergedRows - 1, c: 0 } },
        { s: { r: currentRow, c: 1 }, e: { r: currentRow + row.mergedRows - 1, c: 1 } }
      );
      currentRow += row.mergedRows;
    } else {
      currentRow += 1;
    }
  });

  ws['!merges'] = merges;

  // Стили для заголовка
  const headerStyle = {
    font: { bold: true, sz: 16 },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  // Стили для ячеек таблицы
  const cellStyle = {
    alignment: { wrapText: true, vertical: 'top' },
    border: {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  // Применение стилей ко всем ячейкам
  for (let R = 0; R < data.length + 3; ++R) {
    for (let C = 0; C < headers.length; ++C) {
      const cellRef = XLSX.utils.encode_cell({r: R, c: C});
      if (!ws[cellRef]) ws[cellRef] = {};
      ws[cellRef].s = R === 0 ? headerStyle : cellStyle;
    }
  }

  // Установка ширины столбцов
  const colWidths = [5, 15, 40, 20, 15, 15, 20, 15, 30];
  ws['!cols'] = colWidths.map(width => ({ width }));

  // Добавление листа в книгу
  XLSX.utils.book_append_sheet(wb, ws, "Протокол планёрки");

  // Сохранение файла
  XLSX.writeFile(wb, `протокол_планёрки_${protocolNumber}.xlsx`);
};