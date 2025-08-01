import React from 'react';
import {
  convertToCSV,
  convertToJSON,
  convertToMarkdown,
  type DataType,
} from '../utils/convertTo';
import { escapeHtml } from '../utils';
import { notify } from '../features/notification/notification';

const ExportDropdown: React.FC<{ data: DataType; name: string }> = ({
  data,
  name,
}) => {
  const handleCopyCSV = async () => {
    const text = convertToCSV(data);
    await copyTextToClipboard(text, 'CSV', false);
  };

  const handleCopyMarkdown = async () => {
    const text = convertToMarkdown(data, name);
    await copyTextToClipboard(text, 'Markdown', true);
  };

  const handleCopyJSON = async () => {
    const text = convertToJSON(data);
    await copyTextToClipboard(text, 'JSON', false);
  };

  const handleDownloadCSV = () => {
    downloadText(convertToCSV(data), name, 'csv');
  };

  const handleDownloadMarkdown = () => {
    downloadText(convertToMarkdown(data, name), name, 'md');
  };

  const handleDownloadJSON = () => {
    downloadText(convertToJSON(data), name, 'json');
  };

  return (
    <div className="btn-group">
      <button
        type="button"
        className="btn btn-primary dropdown-toggle m-2"
        data-bs-toggle="dropdown"
        disabled={!data?.length}
        title="Export filtered data"
      >
        <i className="bi bi-cloud-download" />
      </button>
      <ul className="dropdown-menu">
        <li>
          <button className="dropdown-item" onClick={handleCopyCSV}>
            Copy to Clipboard as CSV
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={handleCopyMarkdown}>
            Copy to Clipboard as Markdown
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={handleCopyJSON}>
            Copy to Clipboard as JSON
          </button>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button className="dropdown-item" onClick={handleDownloadCSV}>
            Download as CSV file
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={handleDownloadMarkdown}>
            Download as Markdown file
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={handleDownloadJSON}>
            Download as JSON file
          </button>
        </li>
      </ul>
    </div>
  );
};

const copyTextToClipboard = async (
  text: string,
  type: string,
  isMonospace: boolean,
) => {
  try {
    // NOTE: navigator.clipboard isn't available if protocol isn't secure (HTTPS)
    if (isMonospace && navigator.clipboard.write) {
      const html = `<pre style="font-family: monospace">${escapeHtml(text)}</pre>`;

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([text], { type: 'text/plain' }),
          'text/html': new Blob([html], { type: 'text/html' }),
        }),
      ]);
    } else {
      await navigator.clipboard.writeText(text);
    }
    notify.success(`${type} text copied to clipboard!`);
  } catch (err) {
    console.error(`Failed to copy ${type} text to clipboard: `, err);
    notify.error(`Failed to copy ${type} text to clipboard`);
  }
};

const downloadText = (
  text: string,
  filename: string,
  extension: string,
): void => {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `${filename}_${new Date().toISOString().split('T')[0]}.${extension}`,
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default ExportDropdown;
