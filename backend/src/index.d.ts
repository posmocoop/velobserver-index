export interface ClassifiedEdge {
  id?: number;
  network_ogc_fid : number;
  user_id : string;
  width? : number;
  safety: number;
  conflict: number;
  attractiveness: number;
  city?: string;
  country_code?: string;
  country_name?: string;
  lat?: number;
  lon?: number;
  region_code?: string;
  region_name?: string;
  postcode?: string;
  ip?: string;
}

export interface EmbedMapStatistic {
  id?: number;
  country_code?: string;
  country_name?: string;
  city?: string;
  lat?: number;
  lon?: number;
  region_code?: string;
  region_name?: string;
  postcode?: string;
  ip_address?: string;
}

export interface Persona {
  bike_frequency: any;
  bike_type: any;
  bike_usage: any;
  transport_mode: any;
  user: {
    id: string;
  };
}

export interface VoteEdge {
  image_id : number;
  network_ogc_fid : number;
  user_id : string;
  width? : number;
  updating_field: string;
  updating_value: string;
  city?: string;
  country_code?: string;
  country_name?: string;
  lat?: number;
  lon?: number;
  region_code?: string;
  region_name?: string;
  postcode?: string;
  ip?: string;
}

export interface RouteImage {
  network_ogc_fid?: number;
  image_name: string;
  image_url: string;
  fk_route_id: number;
  exif_datetime?: number;
  exif_lat?: number;
  exif_lon?: number;
  pin_lat?: number;
  pin_lon?: number;
  street_name?: string;
  street_number?: string;
  neighborhood?: string;
  city?: string;
  geoid?: string;
  country_code?: string;
}