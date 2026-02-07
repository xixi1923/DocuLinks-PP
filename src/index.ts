/**
 * Cloudflare Worker - Auto Upload Handler
 * Handles file uploads from DocuLinks Post Page
 * Stores files in R2 and returns public URL
 */

import { Router } from 'itty-router'

const router = Router()

// Shared CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
}

// Preflight
router.options('*', () => new Response(null, { status: 204, headers: corsHeaders }))

// Upload endpoint
router.post('/api/upload', async (request, env) => {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string | null
    const category = formData.get('category') as string | null
    const university = formData.get('university') as string | null
    const userId = formData.get('userId') as string | null

    if (!file || !title || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: file, title, userId' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const MAX_FILE_SIZE = 50 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 50MB' }),
        { status: 413, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/png',
      'image/jpeg'
    ]

    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Allowed: PDF, DOC, PPT, XLS, PNG, JPG' }),
        { status: 415, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${userId}/${timestamp}-${randomId}.${fileExtension}`

    const fileBuffer = await file.arrayBuffer()

    const objectKey = `documents/${uniqueFileName}`
    await env.DOCUMENTS_BUCKET.put(objectKey, fileBuffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'max-age=3600'
      },
      customMetadata: {
        title: title,
        category: category || 'General',
        university: university || 'Unknown',
        uploadedBy: userId,
        uploadedAt: new Date().toISOString()
      }
    })

    const publicUrl = `${env.R2_PUBLIC_URL}/${objectKey}`

    return new Response(
      JSON.stringify({
        success: true,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        objectKey,
        publicUrl,
        message: 'File uploaded successfully to R2'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    console.error('Upload error:', message)

    return new Response(
      JSON.stringify({ error: 'Upload failed', message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})

// Health/config endpoint
router.get('/api/upload/config', async () => {
  return new Response(
    JSON.stringify({
      maxFileSize: 50 * 1024 * 1024,
      allowedTypes: [
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
      endpoint: '/api/upload'
    }),
    { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  )
})

/**
 * DELETE /api/upload/:fileKey
 * Deletes file from R2 (admin only)
 */
router.delete('/api/upload/:fileKey', async (request, env) => {
  try {
    const fileKey = request.params.fileKey
    
    // TODO: Add admin authentication check
    
    await env.DOCUMENTS_BUCKET.delete(`documents/${fileKey}`)
    
    return new Response(
      JSON.stringify({ success: true, message: 'File deleted' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(
      JSON.stringify({ error: 'Delete failed', message: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})

// 404 handler
router.all('*', () => new Response('Not Found', { status: 404 }))

// Export handler
export default {
  fetch: router.handle
}
