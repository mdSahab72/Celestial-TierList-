import React, { useState, useEffect } from 'react';

interface ResizerProps {
  onResize: (delta: number) => void;
}

export function Resizer({ onResize }: ResizerProps) {
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        onResize(e.movementX);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onResize]);

  return (
    <div
      className="w-1 cursor-col-resize hover:bg-purple-500 absolute right-0 top-0 bottom-0 z-20"
      onMouseDown={() => setIsResizing(true)}
    />
  );
}
