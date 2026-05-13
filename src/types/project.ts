export interface Project {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  content?: string; // Deskripsi panjang / Case Study
  tags: string[];
  image: string;
  gallery?: string[]; // Foto-foto tambahan
  githubUrl?: string;
  demoUrl?: string;
  startDate?: string;
  endDate?: string;
  isOngoing: boolean;
  client?: string; // Nama klien (opsional)
  role?: string; // Peran Anda (opsional)
  slug: string;
}

export interface ProjectFormData {
  id?: string;
  title: string;
  description: string;
  content?: string;
  tags: string;
  image: string;
  gallery: string[]; // Diubah menjadi array untuk memudahkan UI Gallery Manager
  githubUrl?: string;
  demoUrl?: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  client?: string;
  role?: string;
  slug: string;
}
