export interface DataEntity {
  group_name: string;
  id: number;
  data: DataEntity1[];
  started_at: string;
  title: string;
  group_average: [number, number][];
  group_total: [number, number][];
}
export interface DataEntity1 {
  name: string;
  data: [number, number][];
  status: string;
}
