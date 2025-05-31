import React from 'react';

const SpacingGuide: React.FC<{ className?: string }> = ({ className = '' }) => {
  const spacingSizes = [
    { name: '0.5', value: '4px', usage: 'Fine-grained spacing, labels above inputs' },
    { name: '1', value: '8px', usage: 'Small gaps, tight spacing' },
    { name: '2', value: '16px', usage: 'Standard gaps, component padding' },
    { name: '3', value: '24px', usage: 'Section padding, larger gaps' },
    { name: '4', value: '32px', usage: 'Major section spacing' },
    { name: '5', value: '40px', usage: 'Large section spacing' },
    { name: '6', value: '48px', usage: 'Extra large spacing' },
  ];

  return (
    <div className={`rounded-xl bg-white p-4 border border-primary/24 flex flex-col space-y-4 ${className}`}>
      <h2 className="text-lg font-medium text-primary-dark mb-4">Spacing Guide</h2>
      <div className="space-y-4">
        {spacingSizes.map((size) => (
          <div key={size.name} className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded">
              <span className="text-xs font-medium uppercase text-primary">{size.name}</span>
            </div>
            <div>
              <div className="font-medium text-base text-gray-700">{size.value}</div>
              <div className="text-base text-gray-700">{size.usage}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-muted rounded-xl">
        <h3 className="text-lg font-medium text-primary-dark mb-2">Usage Guidelines:</h3>
        <ul className="list-disc list-inside text-base text-gray-700 space-y-1">
          <li>Use spacing-0.5 (4px) for fine-grained spacing like labels above inputs</li>
          <li>Use spacing-1 (8px) for tight gaps between related elements</li>
          <li>Use spacing-2 (16px) for standard component padding and gaps</li>
          <li>Use spacing-3 (24px) for section padding and larger gaps</li>
          <li>Use spacing-4 (32px) and above for major section spacing</li>
        </ul>
      </div>
    </div>
  );
};

export default SpacingGuide; 