export interface Protocol {
  id?: number;
  date: string;
  name: string;
  number: string | number;
  secretary: string;
  rows?: any[]; // Поле для хранения данных таблицы
}