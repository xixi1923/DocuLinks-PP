import {NextRequest, NextResponse} from "next/server";
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {GetObjectCommand} from "@aws-sdk/client-s3";
import {db} from "@/lib/firebaseClient";
import {collection, addDoc, serverTimestamp} from "firebase/firestore";

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_S3_SECRET_ACCESS_KEY || "",
  },
});

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS request (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, {headers: corsHeaders});
}

// Handle POST request (file upload)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const category = formData.get("category") as string | null;
    const university = formData.get("university") as string | null;
    const userId = formData.get("userId") as string | null;
    const userEmail = formData.get("userEmail") as string | null;
    const description = formData.get("description") as string | null;

    // Validate required fields
    if (!file || !title || !userId) {
      return NextResponse.json(
          {error: "Missing required fields: file, title, userId"},
          {status: 400, headers: corsHeaders}
      );
    }

    // Validate file size (50MB max)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
          {error: "File too large. Maximum size is 50MB"},
          {status: 413, headers: corsHeaders}
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
          {error: "Invalid file type. Allowed: PDF, DOC, PPT, XLS, PNG, JPG"},
          {status: 415, headers: corsHeaders}
      );
    }

    // Generate unique file key
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop();
    const key = `documents/${userId}/${timestamp}-${randomId}.${fileExtension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME || "doculinks-documents",
          Key: key,
          Body: buffer,
          ContentType: file.type,
          Metadata: {
            title: title,
            category: category || "General",
            university: university || "Unknown",
            uploadedBy: userId,
            uploadedAt: new Date().toISOString(),
          },
        })
    );

    // Generate SIGNED URL (valid for 7 days - R2 maximum) - Fix for R2 private bucket
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || "doculinks-documents",
      Key: key,
      ResponseContentDisposition: 'inline', // Add inline disposition BEFORE signing
    });
    
    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 604800, // 7 days in seconds (R2 maximum for presigned URLs)
    });

    // Use signed URL instead of direct endpoint URL
    const publicUrl = signedUrl;

    // Save metadata to Firestore
    const docRef = await addDoc(collection(db, "documents"), {
      title: title,
      category_id: parseInt(category || "1"),
      university: university || "",
      description: description || "",
      user_id: userId,
      user_email: userEmail || "",
      file_url: publicUrl,
      file_type: file.type,
      file_size: file.size,
      status: "pending",
      likes_count: 0,
      favorites_count: 0,
      comments_count: 0,
      created_at: serverTimestamp(),
    });

    // Return success response
    return NextResponse.json(
        {
          success: true,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          objectKey: key,
          publicUrl,
          documentId: docRef.id,
          message: "File uploaded successfully to R2 and metadata saved to Firestore",
        },
        {status: 200, headers: corsHeaders}
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
        {
          error: "Upload failed",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        {status: 500, headers: corsHeaders}
    );
  }
}
