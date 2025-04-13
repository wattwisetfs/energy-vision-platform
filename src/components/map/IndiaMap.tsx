
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface Location {
  name: string;
  lat: number;
  lng: number;
  state: string;
  resourceType: string;
}

interface IndiaMapProps {
  locations: Location[];
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
}

const IndiaMap: React.FC<IndiaMapProps> = ({ locations, selectedLocation, onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // States with major coordinates for simplified visualization
  const states = [
    { name: 'Karnataka', x: 45, y: 75 },
    { name: 'Maharashtra', x: 40, y: 60 },
    { name: 'Tamil Nadu', x: 50, y: 85 },
    { name: 'Gujarat', x: 25, y: 55 },
    { name: 'Delhi', x: 45, y: 40 },
    { name: 'Rajasthan', x: 30, y: 45 },
    { name: 'Uttar Pradesh', x: 55, y: 40 },
    { name: 'West Bengal', x: 75, y: 50 },
    { name: 'Telangana', x: 50, y: 65 },
    { name: 'Andhra Pradesh', x: 55, y: 75 }
  ];

  const getResourceColor = (resourceType: string) => {
    switch (resourceType) {
      case 'solar': return '#FFBF36'; // yellow
      case 'wind': return '#4B70F5';  // blue
      case 'hydro': return '#16B9E0'; // cyan
      case 'coal': return '#6E6E6E';  // gray
      default: return '#9B87F5';      // purple (default)
    }
  };

  return (
    <div className="w-full h-[400px] bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden relative">
      {/* India map outline - simplified SVG representation */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))' }}
      >
        {/* Simplified India map outline */}
        <path 
          d="M25,25 C25,25 30,15 40,15 C50,15 55,20 60,15 C65,10 80,15 80,25 C80,35 85,45 80,55 C75,65 80,70 70,80 C60,90 50,85 40,85 C30,85 25,75 20,65 C15,55 20,45 20,35 C20,25 25,25 25,25 Z" 
          fill="#E5DEFF" 
          stroke="#9B87F5" 
          strokeWidth="1"
        />

        {/* Draw state boundaries */}
        {states.map((state) => (
          <g key={state.name}>
            {/* Subtle state indicator */}
            <circle cx={state.x} cy={state.y} r="3" fill="#9B87F5" opacity="0.3" />
            <text 
              x={state.x} 
              y={state.y + 6} 
              fontSize="2" 
              fill="#6E59A5" 
              textAnchor="middle"
              className="text-xs"
            >
              {state.name}
            </text>
          </g>
        ))}

        {/* Plot locations on the map */}
        {locations.map((location, index) => {
          // Map the actual lat/lng to the SVG viewBox
          // This is a simplification - in a real app, you would use proper geo projection
          const x = 20 + (location.lng - 72) * 3; // Simple mapping for demonstration
          const y = 20 + (location.lat - 8) * 3;  // Adjust for India's latitude range
          
          return (
            <g 
              key={index} 
              transform={`translate(${x}, ${y})`}
              onClick={() => onLocationSelect(location)}
              className="cursor-pointer"
              style={{ transform: selectedLocation?.name === location.name ? 'scale(1.2)' : 'scale(1)' }}
            >
              <circle 
                r="2.5" 
                fill={getResourceColor(location.resourceType)}
                stroke={selectedLocation?.name === location.name ? 'white' : 'none'}
                strokeWidth="0.5"
                opacity="0.8"
              />
              <circle 
                r="1.5" 
                fill={selectedLocation?.name === location.name ? 'white' : getResourceColor(location.resourceType)}
              />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm flex flex-col gap-2">
        <div className="text-xs font-semibold mb-1">Resource Types</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-xs">Solar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs">Wind</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
          <span className="text-xs">Hydro</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-xs">Coal</span>
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;
