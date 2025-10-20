import { memo } from 'react';

const ScanlineOverlay = memo(() => {
  return (
    <div className="scanline-overlay" aria-hidden="true"></div>
  );
});

ScanlineOverlay.displayName = 'ScanlineOverlay';

export default ScanlineOverlay;

