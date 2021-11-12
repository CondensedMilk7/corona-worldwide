// The type of data received from baseUrl/timeline request
export interface TimelineData {
  data: LatestGlobalData[];
  _cacheHit: boolean;
}
// extracted relevant data from fetched TimelineData
export interface LatestGlobalData {
  active: number;
  confirmed: number;
  date: string;
  deaths: number;
  new_confirmed: number;
  new_deaths: number;
  new_recovered: number;
  recovered: number;
  updated_at: string;
}
