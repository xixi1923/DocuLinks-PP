const functions = require("firebase-functions");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const Busboy = require("busboy");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Initialize S3 client for Cloudflare R2
const getR2Config = () => {
  const config = functions.config();
  return {
    endpoint: (config.r2 && config.r2.endpoint) || process.env.R2_S3_ENDPOINT,
    accessKeyId: (config.r2 && config.r2.access_key) || process.env.R2_S3_ACCESS_KEY_ID,
    secretAccessKey: (config.r2 && config.r2.secret_key) || process.env.R2_S3_SECRET_ACCESS_KEY,
    bucket: (config.r2 && config.r2.bucket) || process.env.R2_BUCKET_NAME || "doculinks-documents",
    publicUrl: (config.r2 && config.r2.public_url) || process.env.R2_ENDPOINT ||
      "https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com",
  };
};

const r2Config = getR2Config();

const s3Client = new S3Client({
  region: "auto",
  endpoint: r2Config.endpoint,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
});

/**
 * Upload file to Cloudflare R2 and save metadata to Firestore
 * 
 * Endpoint: POST /uploadFileToR2
 * 
 * Request body (multipart/form-data):
 * - file: File to upload
 * - title: Document title
 * - category: Category ID
 * - university: University name
 * - userId: User ID
 * - description: Document description (optional)
 */
exports.uploadFileToR2 = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const busboy = Busboy({ headers: req.headers });
  const uploadData = {};
  let fileBuffer = Buffer.alloc(0);
  let fileInfo = {};

  busboy.on("file", (fieldname, file, info) => {
    const { filename, encoding, mimeType } = info;
    fileInfo = { filename, encoding, mimeType };

    file.on("data", (data) => {
      fileBuffer = Buffer.concat([fileBuffer, data]);
    });
  });

  busboy.on("field", (name, value) => {
    uploadData[name] = value;
  });

  busboy.on("finish", async () => {
    try {
      // Validate required fields
      if (!fileBuffer || fileBuffer.length === 0) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!uploadData.title || !uploadData.userId) {
        return res.status(400).json({ 
          error: "Missing required fields: title, userId" 
        });
      }

      // Validate file size (50MB max)
      const MAX_FILE_SIZE = 50 * 1024 * 1024;
      if (fileBuffer.length > MAX_FILE_SIZE) {
        return res.status(413).json({ 
          error: "File too large. Maximum size is 50MB" 
        });
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

      if (!allowedTypes.includes(fileInfo.mimeType)) {
        return res.status(415).json({ 
          error: "Invalid file type. Allowed: PDF, DOC, PPT, XLS, PNG, JPG" 
        });
      }

      // Generate unique file key
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileExtension = fileInfo.filename.split(".").pop();
      const key = `documents/${uploadData.userId}/${timestamp}-${randomId}.${fileExtension}`;

      // Upload to R2
      await s3Client.send(
        new PutObjectCommand({
          Bucket: r2Config.bucket,
          Key: key,
          Body: fileBuffer,
          ContentType: fileInfo.mimeType,
          Metadata: {
            title: uploadData.title,
            category: uploadData.category || "General",
            university: uploadData.university || "Unknown",
            uploadedBy: uploadData.userId,
            uploadedAt: new Date().toISOString(),
          },
        })
      );

      // Generate public URL
      const publicUrl = `${r2Config.publicUrl}/${key}`;

      // Save metadata to Firestore
      const docRef = await db.collection("documents").add({
        title: uploadData.title,
        category_id: parseInt(uploadData.category) || 1,
        university: uploadData.university || "",
        description: uploadData.description || "",
        user_id: uploadData.userId,
        user_email: uploadData.userEmail || "",
        file_url: publicUrl,
        file_type: fileInfo.mimeType,
        file_size: fileBuffer.length,
        status: "pending",
        likes_count: 0,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Return success response
      res.status(200).json({
        success: true,
        fileName: fileInfo.filename,
        fileSize: fileBuffer.length,
        fileType: fileInfo.mimeType,
        objectKey: key,
        publicUrl,
        documentId: docRef.id,
        message: "File uploaded successfully to R2 and metadata saved to Firestore",
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ 
        error: "Upload failed", 
        message: err.message 
      });
    }
  });

  busboy.on("error", (error) => {
    console.error("Busboy error:", error);
    res.status(500).json({ 
      error: "File upload failed", 
      message: error.message 
    });
  });

  req.pipe(busboy);
});

/**
 * Get upload configuration
 * 
 * Endpoint: GET /getUploadConfig
 */
exports.getUploadConfig = functions.https.onRequest((req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  res.status(200).json({
    maxFileSize: 50 * 1024 * 1024,
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/png",
      "image/jpeg",
    ],
    allowedExtensions: ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "png", "jpg", "jpeg"],
  });
});

/**
 * Set Admin Role (secure)
 *
 * Endpoint: POST /setAdmin
 * Headers: Authorization: Bearer <Firebase ID Token of caller>
 * Body: { uid: string } OR { email: string }
 *
 * Security: Only callers whose email is in the allowlist can execute.
 * Configure allowlist via:
 *   firebase functions:config:set admins.emails="owner@example.com,teammate@example.com"
 * or set env ADMIN_EMAILS (comma-separated) in your deployment environment.
 */
exports.setAdmin = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    if (!token) return res.status(401).json({ error: "Missing Authorization bearer token" });

    const decoded = await admin.auth().verifyIdToken(token);
    const callerEmail = decoded.email || "";

    const cfg = functions.config();
    const allowCfg = (cfg.admins && cfg.admins.emails) || process.env.ADMIN_EMAILS || "";
    const allowList = allowCfg.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

    if (!callerEmail || !allowList.includes(callerEmail.toLowerCase())) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { uid, email } = req.body || {};
    let targetUid = uid;
    if (!targetUid && email) {
      const user = await admin.auth().getUserByEmail(email);
      targetUid = user.uid;
    }
    if (!targetUid) return res.status(400).json({ error: "Provide uid or email" });

    await admin.auth().setCustomUserClaims(targetUid, { role: "admin" });
    return res.status(200).json({ ok: true, uid: targetUid, role: "admin" });
  } catch (err) {
    console.error("setAdmin error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
});
