const BUCKET_NAME = 'ece1724-proj'; // Replace with your bucket name
const BASE_URL = `https://storage.googleapis.com/storage/v1/b/${BUCKET_NAME}`;
const API_KEY = 'AIzaSyAlgISOArpcYEgKkvSf73ZkcPxdEBAWDag';

export const loadImageFromBucket = async (imageName: string): Promise<string | null> => {
  try {
    const filePath = `car_images/${imageName}`;
    const url = `${BASE_URL}/o/${encodeURIComponent(filePath)}?alt=media&key=${API_KEY}`;

    // Generate the public URL
    return url;
  } catch (error) {
    console.error('Error loading image from bucket:', error);
    return null;
  }
};