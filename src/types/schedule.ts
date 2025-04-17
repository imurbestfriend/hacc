export interface Schedule {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  ExternalID: string;
  Name: string;
  StartTime: string;
  EndTime: string;
  GroupIDs: string;
}

export interface Queue {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  ScheduleID: number;
  OpensAt: string;
  ClosesAt: string;
  IsActive: boolean;
  MaxParticipants: number;
}

export interface ScheduleItem {
  schedule: Schedule;
  queue?: Queue;
}

export interface ScheduleResponse {
  [index: number]: ScheduleItem;
}

export interface ScheduleByDay {
  [date: string]: ScheduleItem[];
}