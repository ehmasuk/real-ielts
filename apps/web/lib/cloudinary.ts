/**
 * Cloudinary Frontend Upload Utility
 *
 * This utility handles uploading files directly from the browser to Cloudinary
 * using an unsigned upload preset. This avoids sending large files through
 * your backend and keeps your API secret secure.
 */

// Note: Using the exact spelling from your .env file
const CLOUD_NAME = process.env.NEXT_PUBLIC_COUDINARY_CLOUD_NAME || ""
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""

if (!CLOUD_NAME) {
  console.warn("Cloudinary Cloud Name is not configured in environment variables.")
}

if (!UPLOAD_PRESET) {
  console.warn("Cloudinary Upload Preset is not configured in environment variables.")
}

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  format: string
  width: number
  height: number
  bytes: number
  original_filename: string
}

/**
 * Uploads a file directly to Cloudinary.
 *
 * @param file The File object (e.g., from an <input type="file" />)
 * @returns A promise that resolves to the uploaded image's secure URL and metadata.
 */
export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary configuration is missing")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)

  // Using 'auto' allows Cloudinary to detect if the file is an image, video, or raw file
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || "Failed to upload to Cloudinary")
    }

    const data = await response.json()
    return data as CloudinaryUploadResult
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw error
  }
}
