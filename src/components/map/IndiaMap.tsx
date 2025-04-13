
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

  // More accurate states data with proper positioning
  const states = [
    { name: 'Jammu and Kashmir', x: 40, y: 22 },
    { name: 'Himachal Pradesh', x: 45, y: 32 },
    { name: 'Punjab', x: 37, y: 37 },
    { name: 'Uttarakhand', x: 52, y: 37 },
    { name: 'Haryana', x: 42, y: 42 },
    { name: 'Delhi', x: 42, y: 45 },
    { name: 'Rajasthan', x: 30, y: 50 },
    { name: 'Uttar Pradesh', x: 55, y: 45 },
    { name: 'Bihar', x: 68, y: 48 },
    { name: 'Sikkim', x: 76, y: 40 },
    { name: 'Arunachal Pradesh', x: 87, y: 38 },
    { name: 'Nagaland', x: 85, y: 45 },
    { name: 'Manipur', x: 83, y: 50 },
    { name: 'Mizoram', x: 82, y: 55 },
    { name: 'Tripura', x: 79, y: 52 },
    { name: 'Meghalaya', x: 78, y: 47 },
    { name: 'Assam', x: 82, y: 45 },
    { name: 'West Bengal', x: 72, y: 55 },
    { name: 'Jharkhand', x: 65, y: 55 },
    { name: 'Odisha', x: 65, y: 62 },
    { name: 'Chhattisgarh', x: 58, y: 60 },
    { name: 'Madhya Pradesh', x: 48, y: 55 },
    { name: 'Gujarat', x: 25, y: 58 },
    { name: 'Maharashtra', x: 40, y: 65 },
    { name: 'Telangana', x: 50, y: 68 },
    { name: 'Andhra Pradesh', x: 55, y: 75 },
    { name: 'Karnataka', x: 43, y: 78 },
    { name: 'Goa', x: 35, y: 77 },
    { name: 'Kerala', x: 43, y: 88 },
    { name: 'Tamil Nadu', x: 50, y: 85 }
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

  const getResourceOpacity = (resourceType: string) => {
    return selectedLocation?.resourceType === resourceType ? 1 : 0.7;
  };

  // This is a simplified map of India with more accurate outlines
  return (
    <div className="w-full h-[500px] bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden relative">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))' }}
      >
        {/* More accurate India map outline */}
        <path 
          d="M38,20 C38,20 33,20 33,23 C33,26 31,28 30,30 C29,32 23,37 23,40 C23,43 20,45 20,47 C20,49 20,51 21,53 C22,55 23,56 24,57 C25,58 23,62 24,64 C25,66 27,70 27,72 C27,74 32,73 35,73 C38,73 37,68 38,67 C39,66 42,65 43,66 C44,67 45,66 46,70 C47,74 50,77 51,77 C52,77 52,77 54,77 C56,77 56,76 58,77 C60,78 61,78 62,77 C63,76 65,75 66,73 C67,71 66,69 67,67 C68,65 70,63 71,61 C72,59 73,54 71,52 C69,50 69,49 69,48 C69,47 70,46 73,45 C76,44 79,41 79,39 C79,37 78,35 78,34 C78,33 73,30 72,29 C71,28 70,25 68,25 C66,25 64,27 63,27 C62,27 62,23 59,22 C56,21 55,25 52,26 C49,27 47,29 46,30 C45,31 42,32 41,31 C40,30 42,27 42,25 C42,23 41,23 40,22 C39,21 38,20 38,20 Z"
          fill="#8DAB7F" 
          stroke="#FFFFFF" 
          strokeWidth="0.5"
        />
        
        {/* State boundaries (simplified) */}
        <g stroke="#FFFFFF" strokeWidth="0.2" fill="none">
          {/* Northern states */}
          <path d="M38,20 C38,22 37,24 35,25 C33,26 33,28 35,30 C37,32 40,32 40,35" />
          <path d="M40,35 C40,37 42,39 45,39 C48,39 50,41 52,41" />
          <path d="M52,41 C54,41 55,42 56,44 C57,46 59,47 62,47" />
          <path d="M40,35 C38,37 36,40 35,42 C34,44 32,47 30,49" />
          
          {/* Western states */}
          <path d="M30,49 C28,52 25,55 24,58 C23,61 25,64 27,66" />
          <path d="M27,66 C29,68 32,70 35,70 C38,70 38,68 38,67" />
          <path d="M30,49 C33,50 35,52 37,54 C39,56 41,58 42,60" />
          
          {/* Central states */}
          <path d="M42,60 C44,62 47,64 50,64 C53,64 55,67 57,70" />
          <path d="M57,70 C59,73 60,75 62,77" />
          <path d="M52,41 C53,45 55,48 57,50 C59,52 60,56 62,58" />
          <path d="M62,58 C64,60 65,63 65,66 C65,69 66,71 67,73" />
          
          {/* Eastern states */}
          <path d="M62,47 C65,47 67,48 69,48" />
          <path d="M69,48 C71,48 73,47 75,45 C77,43 79,41 79,39" />
          <path d="M69,48 C70,50 71,52 71,55 C71,58 70,61 68,64" />
          <path d="M68,64 C66,67 65,70 65,73 C65,76 67,77 67,73" />
        </g>
        
        {/* State labels - only show for larger screens for readability */}
        <g className="hidden md:block">
          {states.map((state) => (
            <text 
              key={state.name} 
              x={state.x} 
              y={state.y} 
              fontSize="1.3" 
              fill="#666666"
              textAnchor="middle"
              className="text-[0.18rem] font-light pointer-events-none"
            >
              {state.name}
            </text>
          ))}
        </g>

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
              className="cursor-pointer transition-transform duration-200 hover:scale-125"
              style={{ 
                transform: selectedLocation?.name === location.name ? 'scale(1.2)' : 'scale(1)'
              }}
            >
              <circle 
                r="2.5" 
                fill={getResourceColor(location.resourceType)}
                stroke={selectedLocation?.name === location.name ? 'white' : 'none'}
                strokeWidth="0.5"
                opacity={getResourceOpacity(location.resourceType)}
              />
              <circle 
                r="1.3" 
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

      {/* Image attribution */}
      <div className="absolute bottom-2 right-2 text-[0.6rem] text-gray-400">
        India Grid Map
      </div>
      
      {/* Use the uploaded image as a background reference to align the map */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0">
        <img 
          src="/lovable-uploads/de342a36-7bd1-4b74-957c-53b2c6b31900.png" 
          alt="India Map Reference" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default IndiaMap;
