
import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import { Button } from '@/components/ui/button';
import { Loader2, Maximize2, Minimize2 } from 'lucide-react';

// GeoJSON for India with states
const INDIA_TOPO_JSON = 'https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json';

interface Location {
  name: string;
  lat: number;
  lng: number;
  state: string;
  resourceType: string;
}

interface EnhancedIndiaMapProps {
  locations: Location[];
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  className?: string;
}

const EnhancedIndiaMap: React.FC<EnhancedIndiaMapProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
  className,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'solar':
        return '#F59E0B'; // yellow-500
      case 'wind':
        return '#3B82F6'; // blue-500
      case 'hydro':
        return '#06B6D4'; // cyan-500
      case 'coal':
      default:
        return '#6B7280'; // gray-500
    }
  };

  const toggleExpand = () => {
    setLoading(true);
    // Simulate loading for better UX
    setTimeout(() => {
      setExpanded(!expanded);
      setLoading(false);
    }, 300);
  };

  return (
    <div className={`relative ${className || ''}`}>
      <div className={`transition-all duration-500 ease-in-out ${expanded ? 'h-[80vh]' : 'h-[400px]'}`}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: expanded ? 1200 : 800,
            center: [78.9629, 22.5937] // Centered on India
          }}
          className="w-full h-full"
        >
          <ZoomableGroup>
            <Geographies geography={INDIA_TOPO_JSON}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#F1F5F9"
                    stroke="#CBD5E1"
                    style={{
                      default: { outline: "none", fill: "#F1F5F9" },
                      hover: { outline: "none", fill: "#E2E8F0" },
                      pressed: { outline: "none", fill: "#CBD5E1" },
                    }}
                  />
                ))
              }
            </Geographies>

            {locations.map((location, index) => (
              <Marker
                key={`marker-${index}`}
                coordinates={[location.lng, location.lat]}
                data-tooltip-id="location-tooltip"
                data-tooltip-content={location.name}
                onMouseEnter={() => setTooltipContent(`${location.name} (${location.resourceType})`)}
                onClick={() => onLocationSelect(location)}
              >
                <circle
                  r={selectedLocation?.name === location.name ? 8 : 5}
                  fill={getResourceTypeColor(location.resourceType)}
                  stroke="#fff"
                  strokeWidth={1}
                  opacity={0.9}
                  className="cursor-pointer hover:opacity-100 transition-all"
                />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
        <Tooltip id="location-tooltip" content={tooltipContent} />
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2 bg-white dark:bg-gray-800"
        onClick={toggleExpand}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : expanded ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
        <span className="ml-1">{expanded ? 'Minimize' : 'Expand'}</span>
      </Button>
    </div>
  );
};

export default EnhancedIndiaMap;
