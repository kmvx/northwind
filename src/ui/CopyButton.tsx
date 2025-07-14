import React from 'react';
import { notify } from '../features/notification/notification';
import { HIDE_DELAY } from '../constants';

const CopyButton: React.FC<{
  content: string;
  inheritColor?: boolean;
}> = ({ content, inheritColor = false }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), HIDE_DELAY);
      notify.success('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
      notify.error('Failed to copy to clipboard');
    }
  };

  return (
    <button
      type="button"
      className={`btn ${inheritColor ? '' : 'btn-outline-primary'} d-inline-flex align-items-center border-0`}
      style={{
        marginTop: '-0.375rem',
        marginBottom: '-0.375rem',
        color: inheritColor ? 'inherit' : undefined,
      }}
      onClick={handleCopy}
      title="Copy to clipboard"
    >
      <i className={`bi ${copied ? 'bi-check-lg' : 'bi-copy'}`}></i>
    </button>
  );
};

export default CopyButton;
