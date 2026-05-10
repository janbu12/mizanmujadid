export interface Project {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  startDate?: string;
  endDate?: string;
  isOngoing: boolean;
}

export interface ProjectFormData {
  id?: string;
  title: string;
  description: string;
  tags: string;
  image: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
}
