import axiosInstance from './axios';

// Type definitions for Picture API
export interface PictureData {
  id?: string;
  patientId?: string;
  drawingData: string; // JSON string with drawing commands
  metadata: string; // JSON string with drawing metadata
  description?: string;
  imageUrl?: string;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'PRIVATE';
  createdAt?: Date;
  lastUpdate?: Date;
}

export interface PictureListItem {
  id: string;
  description?: string;
  status: string;
  createdAt: Date;
  lastUpdate: Date;
}

// Create a new picture
export const savePicture = async (data: PictureData): Promise<PictureData> => {
  const response = await axiosInstance.post('/api/v1/pictures', {
    drawingData: data.drawingData,
    metadata: data.metadata,
    description: data.description,
    imageUrl: data.imageUrl,
    status: data.status || 'PUBLISHED',
  });
  return response.data;
};

// Get all pictures for the current user
export const getPictures = async (): Promise<PictureListItem[]> => {
  const response = await axiosInstance.get('/api/v1/pictures');
  return Array.isArray(response.data)
    ? response.data.map((pic: any) => ({
        id: pic.id,
        description: pic.description,
        status: pic.status,
        createdAt: new Date(pic.createdAt),
        lastUpdate: new Date(pic.lastUpdate),
      }))
    : [];
};

// Get all pictures for a specific patient (e.g. for specialist view)
export const getPatientPictures = async (patientId: string): Promise<PictureListItem[]> => {
  const response = await axiosInstance.get(`/api/v1/pictures/patient/${patientId}`);
  return Array.isArray(response.data)
    ? response.data.map((pic: any) => ({
        id: pic.id,
        description: pic.description,
        status: pic.status,
        createdAt: new Date(pic.createdAt),
        lastUpdate: new Date(pic.lastUpdate),
      }))
    : [];
};

// Get a single picture by ID for specialist
export const getPatientPictureById = async (
  patientId: string,
  id: string
): Promise<PictureData> => {
  const response = await axiosInstance.get(`/api/v1/pictures/patient/${patientId}/${id}`);
  return {
    ...response.data,
    createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
    lastUpdate: response.data.lastUpdate ? new Date(response.data.lastUpdate) : undefined,
  };
};

// Get a single picture by ID (with full drawing data)
export const getPictureById = async (id: string): Promise<PictureData> => {
  const response = await axiosInstance.get(`/api/v1/pictures/${id}`);
  return {
    ...response.data,
    createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
    lastUpdate: response.data.lastUpdate ? new Date(response.data.lastUpdate) : undefined,
  };
};

// Update an existing picture
export const updatePicture = async (id: string, data: PictureData): Promise<PictureData> => {
  const response = await axiosInstance.put(`/api/v1/pictures/${id}`, {
    drawingData: data.drawingData,
    metadata: data.metadata,
    description: data.description,
    imageUrl: data.imageUrl,
    status: data.status || 'PUBLISHED',
  });
  return response.data;
};

// Delete a picture
export const deletePicture = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/v1/pictures/${id}`);
};
