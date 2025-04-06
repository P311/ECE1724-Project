const BUCKET_NAME = 'ece1724-proj'; // Replace with your bucket name
const BASE_URL = `https://storage.googleapis.com/storage/v1/b/${BUCKET_NAME}`;
const BASE_DOWNLOAD_URL = `https://storage.googleapis.com/${BUCKET_NAME}`;
const API_KEY = 'AIzaSyAlgISOArpcYEgKkvSf73ZkcPxdEBAWDag';

export const loadImageFromBucket = async (imageName: string): Promise<string | null> => {
  try {
    const filePath = `car_images/${imageName}`;
    const metadataUrl = `${BASE_URL}/o/${encodeURIComponent(filePath)}?alt=media&key=${API_KEY}`;

    // Check if the file exists
    const metadataResponse = await fetch(metadataUrl);
    if (!metadataResponse.ok) {
      console.error(`Image ${imageName} does not exist in bucket ${BUCKET_NAME}`);
      return null;
    }

    // Generate the public URL
    const publicUrl = `${BASE_DOWNLOAD_URL}/${filePath}`;
    return publicUrl;
  } catch (error) {
    console.error('Error loading image from bucket:', error);
    return null;
  }
};