import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DISTRICT_DATA } from "@/data/districtData";

// Add type declarations for leaflet-fullscreen
declare module "leaflet" {
  namespace Control {
    class Fullscreen extends L.Control {
      constructor(options?: {
        position?: string;
        title?: {
          false: string;
          true: string;
        };
      });
    }
  }
}

interface DistrictMapProps {
  selectedDistricts: string[];
  onDistrictSelect: (district: string) => void;
}

// Fix for Leaflet's default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to handle GeoJSON layer
function DistrictLayer({
  selectedDistricts,
  onDistrictSelect,
}: DistrictMapProps) {
  const map = useMap();
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    // Fetch the GeoJSON data
    fetch(
      "/geo/2022_Council_Districts_(Future)_view_8695257040167361136.geojson"
    )
      .then((response) => {
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text().then((text) => {
          console.log("Response text:", text.substring(0, 100)); // Log first 100 chars
          return JSON.parse(text);
        });
      })
      .then((geoJson) => {
        console.log("Successfully parsed GeoJSON:", geoJson);
        if (geoJsonRef.current) {
          map.removeLayer(geoJsonRef.current);
        }

        const geoJsonLayer = L.geoJSON(geoJson, {
          style: (feature) => {
            const district = feature?.properties?.DISTRICT;
            return {
              fillColor: selectedDistricts.includes(district)
                ? "#4F46E5"
                : "#E5E7EB",
              weight: 1,
              opacity: 1,
              color: "#1F2937",
              fillOpacity: 0.7,
            };
          },
          onEachFeature: (feature, layer) => {
            const district = feature.properties.DISTRICT;
            const tooltipContent = `District ${district}`;
            layer.bindTooltip(tooltipContent, {
              permanent: false,
              direction: "center",
              className: "district-tooltip",
            });

            layer.on({
              click: () => onDistrictSelect(district),
            });
          },
        });

        geoJsonRef.current = geoJsonLayer;
        geoJsonLayer.addTo(map);

        // Fit bounds to the GeoJSON
        map.fitBounds(geoJsonLayer.getBounds());
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });

    return () => {
      if (geoJsonRef.current) {
        map.removeLayer(geoJsonRef.current);
      }
    };
  }, [map, selectedDistricts, onDistrictSelect]);

  return null;
}

// Custom fullscreen control
function FullscreenControl() {
  const map = useMap();
  const mapContainer = map.getContainer();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainer.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const control = L.Control.extend({
      options: {
        position: "topleft",
      },
      onAdd: function () {
        const container = L.DomUtil.create(
          "div",
          "leaflet-control-fullscreen leaflet-bar leaflet-control"
        );
        const link = L.DomUtil.create(
          "a",
          "leaflet-control-fullscreen-button",
          container
        );
        link.href = "#";
        link.title = "Toggle Fullscreen";
        link.innerHTML = "⛶";
        link.style.cssText = `
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 18px;
          background-color: white;
          color: #333;
          border-radius: 4px;
          box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        `;
        link.onclick = (e) => {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          toggleFullscreen();
        };
        return container;
      },
    });

    const fullscreenControl = new control();
    map.addControl(fullscreenControl);

    return () => {
      map.removeControl(fullscreenControl);
    };
  }, [map]);

  return null;
}

export function DistrictMap(props: DistrictMapProps) {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        center={[36.1627, -86.7816]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DistrictLayer {...props} />
        <FullscreenControl />
      </MapContainer>
    </div>
  );
}
