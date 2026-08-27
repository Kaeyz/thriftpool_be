export interface CloudinaryApiResource {
  asset_id: string;
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  url: string;
  secure_url: string;
  next_cursor: string;
  derived: {
    transformation: string;
    format: string;
    bytes: number;
    id: string;
    url: string;
    secure_url: string;
  }[];
}
