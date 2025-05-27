import React from 'react';

const SpacingGuide: React.FC = () => {
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
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-blue-900 mb-4">Spacing Guide</h2>
      <div className="space-y-4">
        {spacingSizes.map((size) => (
          <div key={size.name} className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 flex items-center justify-center rounded">
              {size.name}
            </div>
            <div>
              <div className="font-medium">{size.value}</div>
              <div className="text-sm text-gray-600">{size.usage}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-medium mb-2">Usage Guidelines:</h3>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
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