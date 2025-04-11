import { ReactNode } from "react";
import {
  LatLngBoundsExpression,
  LatLngExpression,
  Map as LeafletMap,
  ControlOptions,
} from "leaflet";

declare module "react-leaflet" {
  export interface MapContainerProps {
    center: LatLngExpression;
    zoom: number;
    scrollWheelZoom?: boolean;
    style?: React.CSSProperties;
    className?: string;
    id?: string;
    whenReady?: (map: LeafletMap) => void;
    whenCreated?: (map: LeafletMap) => void;
    children?: ReactNode;
    bounds?: LatLngBoundsExpression;
    zoomControl?: boolean;
    key?: any;
  }

  export interface TileLayerProps {
    attribution?: string;
    url: string;
    key?: any;
  }

  export interface PopupProps {
    className?: string;
    children?: ReactNode;
  }

  export interface MapProps {
    center: LatLngExpression;
    zoom: number;
  }

  export interface MarkerProps {
    position: LatLngExpression;
    children?: ReactNode;
    key?: any;
  }

  export function MapContainer(props: MapContainerProps): JSX.Element;
  export function TileLayer(props: TileLayerProps): JSX.Element;
  export function Marker(props: MarkerProps): JSX.Element;
  export function Popup(props: PopupProps): JSX.Element;
  export function useMap(): LeafletMap;
}
