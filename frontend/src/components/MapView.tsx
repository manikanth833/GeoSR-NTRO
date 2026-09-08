import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import OSM from 'ol/source/OSM';
import { fromLonLat, transformExtent, toLonLat } from 'ol/proj';
import { SwipeComparison } from './SwipeComparison';
import { api } from '../services/api';
import { SceneMetadata } from '../types';
import { ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';

interface MapViewProps {
  scene: SceneMetadata;
  activeLayers: {
    obs10m: boolean;
    geosr25m: boolean;
    confidence: boolean;
    ndvi: boolean;
    ndwi: boolean;
    segmentation: boolean;
  };
  onHoverCoords?: (coords: { lat: number; lon: number }) => void;
  onSelectPixel?: (lat: number, lon: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  scene,
  activeLayers,
  onHoverCoords,
  onSelectPixel
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const olMapRef = useRef<Map | null>(null);
  const geosrLayerRef = useRef<ImageLayer<ImageStatic> | null>(null);
  const [sliderPos, setSliderPos] = useState<number>(50);

  useEffect(() => {
    if (!mapRef.current) return;

    // Extent of the selected scene: [min_lon, min_lat, max_lon, max_lat]
    const bbox = scene.bbox;
    const mapExtent = transformExtent(bbox, 'EPSG:4326', 'EPSG:3857');
    const center = fromLonLat(scene.coordinates);

    // 10m Sentinel-2 observation layer
    const obs10mLayer = new ImageLayer({
      source: new ImageStatic({
        url: api.getLayerTileUrl(scene.scene_id, '10m'),
        imageExtent: mapExtent,
        projection: 'EPSG:3857',
      }),
      visible: activeLayers.obs10m,
    });

    // 2.5m GeoSR super-resolution layer
    const geosrLayer = new ImageLayer({
      source: new ImageStatic({
        url: api.getLayerTileUrl(scene.scene_id, 'geosr'),
        imageExtent: mapExtent,
        projection: 'EPSG:3857',
      }),
      visible: activeLayers.geosr25m,
    });
    geosrLayerRef.current = geosrLayer;

    // Confidence / Uncertainty layer
    const confidenceLayer = new ImageLayer({
      source: new ImageStatic({
        url: api.getLayerTileUrl(scene.scene_id, 'confidence'),
        imageExtent: mapExtent,
        projection: 'EPSG:3857',
      }),
      visible: activeLayers.confidence,
      opacity: 0.85,
    });

    // NDVI layer
    const ndviLayer = new ImageLayer({
      source: new ImageStatic({
        url: api.getLayerTileUrl(scene.scene_id, 'ndvi'),
        imageExtent: mapExtent,
        projection: 'EPSG:3857',
      }),
      visible: activeLayers.ndvi,
      opacity: 0.9,
    });

    // NDWI layer
    const ndwiLayer = new ImageLayer({
      source: new ImageStatic({
        url: api.getLayerTileUrl(scene.scene_id, 'ndwi'),
        imageExtent: mapExtent,
        projection: 'EPSG:3857',
      }),
      visible: activeLayers.ndwi,
      opacity: 0.9,
    });

    // Downstream Building/Road Segmentation layer
    const segmentationLayer = new ImageLayer({
      source: new ImageStatic({
        url: api.getLayerTileUrl(scene.scene_id, 'segmentation'),
        imageExtent: mapExtent,
        projection: 'EPSG:3857',
      }),
      visible: activeLayers.segmentation,
      opacity: 0.85,
    });

    // Base dark map background (OSM styled dark)
    const baseOsm = new TileLayer({
      source: new OSM(),
      opacity: 0.2,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        baseOsm,
        obs10mLayer,
        geosrLayer,
        confidenceLayer,
        ndviLayer,
        ndwiLayer,
        segmentationLayer,
      ],
      view: new View({
        center: center,
        zoom: 14,
        minZoom: 11,
        maxZoom: 18,
      }),
      controls: [],
    });

    olMapRef.current = map;

    // Canvas clipping for Swipe comparison between 10m (Left) and 2.5m GeoSR (Right)
    const prerenderListener = (event: any) => {
      if (!activeLayers.geosr25m || !activeLayers.obs10m) return;
      const ctx = event.context as CanvasRenderingContext2D;
      const mapSize = map.getSize();
      if (ctx && mapSize) {
        const width = mapSize[0];
        const height = mapSize[1];
        const clipX = width * (sliderPos / 100);
        ctx.save();
        ctx.beginPath();
        ctx.rect(clipX, 0, width - clipX, height);
        ctx.clip();
      }
    };

    const postrenderListener = (event: any) => {
      if (!activeLayers.geosr25m || !activeLayers.obs10m) return;
      const ctx = event.context as CanvasRenderingContext2D;
      if (ctx) {
        ctx.restore();
      }
    };

    geosrLayer.on('prerender', prerenderListener);
    geosrLayer.on('postrender', postrenderListener);

    // Pointer move listener for Lat/Lon readout
    map.on('pointermove', (e) => {
      const coords = toLonLat(e.coordinate);
      if (onHoverCoords) {
        onHoverCoords({ lat: coords[1], lon: coords[0] });
      }
    });

    // Single click for pixel analytics inspection
    map.on('singleclick', (e) => {
      const coords = toLonLat(e.coordinate);
      if (onSelectPixel) {
        onSelectPixel(coords[1], coords[0]);
      }
    });

    return () => {
      geosrLayer.un('prerender', prerenderListener);
      geosrLayer.un('postrender', postrenderListener);
      map.setTarget(undefined);
    };
  }, [scene.scene_id, activeLayers, sliderPos]);

  const handleZoomIn = () => {
    if (!olMapRef.current) return;
    const view = olMapRef.current.getView();
    view.setZoom((view.getZoom() || 14) + 1);
  };

  const handleZoomOut = () => {
    if (!olMapRef.current) return;
    const view = olMapRef.current.getView();
    view.setZoom((view.getZoom() || 14) - 1);
  };

  const handleResetView = () => {
    if (!olMapRef.current) return;
    const view = olMapRef.current.getView();
    view.setCenter(fromLonLat(scene.coordinates));
    view.setZoom(14);
  };

  return (
    <div className="relative w-full h-full bg-[#05080E] overflow-hidden select-none">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Swipe control overlay if both 10m & 2.5m layers are active */}
      {activeLayers.obs10m && activeLayers.geosr25m && (
        <SwipeComparison sliderPos={sliderPos} setSliderPos={setSliderPos} />
      )}

      {/* Floating Map Controls (Zoom, Reset View) */}
      <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-2 bg-[#070B14]/90 p-1.5 rounded-lg border border-[#00F0FF]/30 shadow-panel backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          className="p-2 text-[#00F0FF] hover:bg-[#00F0FF]/20 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-[#00F0FF] hover:bg-[#00F0FF]/20 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 text-[#00F0FF] hover:bg-[#00F0FF]/20 rounded transition-colors border-t border-white/10"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
