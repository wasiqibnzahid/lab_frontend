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

export interface EditEntity {
  group_name: string;
  id: number;
  data: DataEntity2[];
  started_at: string;
  title: string;
  group_average: [number, number][];
  group_total: [number, number][];
}
export interface DataEntity2 {
  name: string;
  data: Record<string, number>;
  status: string;
}

export interface MetricsData {
  study_duration: StudyDuration;
  sacrificed_percentage: number;
  average_days_to_sacrifice: AverageDaysToSacrificeOrAverageDaysToDead;
  average_days_to_dead: AverageDaysToSacrificeOrAverageDaysToDead;
  percentage_died: number;
  average_tumor_growth_before: number;
  average_growth_after: number;
  weekly_average_growth_after_treatment: WeeklyAverageGrowthAfterTreatment;
}
export interface StudyDuration {
  start?: null;
  end?: null;
}
export interface AverageDaysToSacrificeOrAverageDaysToDead {
  from_treatment_start: number;
  from_study_start: number;
}
export interface WeeklyAverageGrowthAfterTreatment {
  labels?: string[] | null;
  datasets?: DatasetsEntity[] | null;
}
export interface DatasetsEntity {
  name: string;
  data: number[];
}
