/**
 * Cloudflare R2 + Firebase Functions Configuration
 * 
 * This file contains the configuration for auto-uploading files
 * to Cloudflare R2 storage via Firebase Functions
 */

// Firebase Function endpoint - automatically configured based on your Firebase project
export const UPLOAD_ENDPOINT = process.env.NEXT_PUBLIC_FIREBASE_FUNCTION_URL ||
  `https://us-central1-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.cloudfunctions.net/uploadFileToR2`

// R2 public domain - for accessing uploaded files
export const R2_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_R2_DOMAIN || 
  process.env.R2_ENDPOINT ||
  'https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com'

// Upload configuration
export const UPLOAD_CONFIG = {
  // Maximum file size (50MB)
  maxFileSize: 50 * 1024 * 1024,

  // Allowed MIME types
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png',
    'image/jpeg'
  ],

  // File extensions
  allowedExtensions: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'],

  // Chunk size for uploads (5MB)
  chunkSize: 5 * 1024 * 1024,

  // Timeout (30 seconds)
  timeout: 30000,

  // Retry attempts
  retries: 3
}

/**
 * Upload file to Cloudflare R2
 * 
 * @param file - File object to upload
 * @param metadata - File metadata (title, category, university, userId)
 * @returns Promise with upload result
 */
export async function uploadToCloudflare(
  file: File,
  metadata: {
    title: string
    category: string
    university: string
    userId: string
  }
): Promise<{
  success: boolean
  fileName: string
  publicUrl: string
  objectKey: string
  fileType: string
  fileSize: number
  error?: string
}> {
  try {
    // Validate file
    if (file.size > UPLOAD_CONFIG.maxFileSize) {
      throw new Error(`File too large. Maximum size is ${UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB`)
    }

    if (!UPLOAD_CONFIG.allowedMimeTypes.includes(file.type)) {
      throw new Error('File type not allowed')
    }

    // Create FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', metadata.title)
    formData.append('category', metadata.category)
    formData.append('university', metadata.university)
    formData.append('userId', metadata.userId)

    // Upload with retry logic
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt < UPLOAD_CONFIG.retries; attempt++) {
      try {
        const response = await fetch(UPLOAD_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || `Upload failed with status ${response.status}`)
        }

        const result = await response.json()

        return {
          success: true,
          fileName: result.fileName,
          publicUrl: result.publicUrl,
          objectKey: result.objectKey,
          fileType: result.fileType,
          fileSize: result.fileSize
        }

      } catch (error) {
        lastError = error as Error
        if (attempt < UPLOAD_CONFIG.retries - 1) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
        }
      }
    }

    throw lastError || new Error('Upload failed after retries')

  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      fileName: file.name,
      publicUrl: '',
      objectKey: '',
      fileType: file.type,
      fileSize: file.size,
      error: (error as Error).message
    }
  }
}

/**
 * Delete file from R2 (requires admin authentication)
 * 
 * @param objectKey - The object key in R2
 * @returns Promise with delete result
 */
export async function deleteFromCloudflare(objectKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${UPLOAD_ENDPOINT}/${objectKey}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`
      }
    })

    if (!response.ok) {
      throw new Error(`Delete failed with status ${response.status}`)
    }

    return { success: true }

  } catch (error) {
    console.error('Delete error:', error)
    return {
      success: false,
      error: (error as Error).message
    }
  }
}

/**
 * Get file URL from object key
 * 
 * @param objectKey - The object key in R2
 * @returns Public URL for the file
 */
export function getFileUrl(objectKey: string): string {
  return `${R2_PUBLIC_DOMAIN}/${objectKey}`
}
