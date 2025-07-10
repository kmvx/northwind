export type DataType = Record<string, any>[] | undefined;

const getHeaders = (data: Record<string, any>[]): string[] => {
  //return Object.keys(data[0]);
  return Array.from(new Set(data.flatMap(Object.keys)));
};

const isDateString = (value: string): boolean => {
  return (
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}.*)?$/.test(value) &&
    !isNaN(Date.parse(value))
  );
};

const formatDate = (date: Date): string => {
  if (date.getHours() || date.getMinutes() || date.getSeconds()) {
    return date.toLocaleString();
  } else {
    return date.toLocaleDateString();
  }
};

const formatValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return formatDate(value);
  }

  if (typeof value === 'string' && isDateString(value)) {
    return formatDate(new Date(value));
  }

  return String(value);
};

export const convertToCSV = (data: DataType): string => {
  if (!data?.length) return '';

  const headers = getHeaders(data);

  const escapeCSV = (val: string): string => {
    return /[,"\n\r]/.test(val) ? `"${val.replace(/"/g, '""')}"` : val;
  };

  const rows = data.map((row) => {
    return headers
      .map((header) => {
        const val = row[header];

        if (val === null || val === undefined) {
          return '';
        }

        if (typeof val === 'number' || typeof val === 'boolean') {
          return String(val);
        }

        if (val instanceof Date) {
          return `"${val.toISOString()}"`;
        }

        return escapeCSV(String(val));
      })
      .join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

export const convertToMarkdown = (data: DataType, title: string): string => {
  if (!data?.length) return '';

  const headers = getHeaders(data);

  const escapeMarkdown = (val: string): string => {
    return val.replace(/\|/g, '\\|');
  };

  const formatted = (value: any): string => {
    return escapeMarkdown(formatValue(value));
  };

  const columnWidths = headers.map((header) => {
    const cellWidths = data.map((row) => formatted(row[header]).length);
    return Math.max(header.length, ...cellWidths);
  });

  const pad = (str: string, len: number): string => {
    return str + ' '.repeat(len - str.length);
  };

  const formatRow = (cells: string[]): string => {
    return `| ${cells.map((cell, i) => pad(cell, columnWidths[i])).join(' | ')} |`;
  };

  const headerRow = formatRow(headers);
  const separatorRow = `| ${columnWidths.map((w) => '-'.repeat(w)).join(' | ')} |`;
  const dataRows = data.map((row) => {
    return formatRow(headers.map((header) => formatted(row[header])));
  });

  return [`# ${title}`, '', headerRow, separatorRow, ...dataRows].join('\n');
};

export const convertToJSON = (data: DataType): string => {
  return JSON.stringify(data, null, 4);
};
