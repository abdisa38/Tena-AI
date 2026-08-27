const { Client, Storage, ID } = require('node-appwrite');

class AppwriteService {
  constructor() {
    // Initialize Appwrite client
    this.client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    this.storage = new Storage(this.client);
    
    // Bucket ID for voice recordings (create this in Appwrite dashboard)
    this.VOICE_BUCKET_ID = 'voice-recordings';
  }

  // Upload file to Appwrite storage
  async uploadFile(file, bucketId = this.VOICE_BUCKET_ID) {
    try {
      const fileId = ID.unique();

      const response = await this.storage.createFile(
        bucketId,
        fileId,
        file
      );

      return {
        success: true,
        data: {
          fileId: response.$id,
          filename: response.name,
          size: response.sizeOriginal,
          mimeType: response.mimeType,
          url: this.getFileUrl(bucketId, response.$id)
        }
      };

    } catch (error) {
      console.error('Appwrite Upload Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get file URL
  getFileUrl(bucketId, fileId) {
    return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
  }

  // Get file download URL
  getFileDownloadUrl(bucketId, fileId) {
    return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/download?project=${process.env.APPWRITE_PROJECT_ID}`;
  }

  // Delete file from storage
  async deleteFile(fileId, bucketId = this.VOICE_BUCKET_ID) {
    try {
      await this.storage.deleteFile(bucketId, fileId);

      return {
        success: true,
        message: 'File deleted successfully'
      };

    } catch (error) {
      console.error('Appwrite Delete Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get file details
  async getFile(fileId, bucketId = this.VOICE_BUCKET_ID) {
    try {
      const file = await this.storage.getFile(bucketId, fileId);

      return {
        success: true,
        data: {
          fileId: file.$id,
          filename: file.name,
          size: file.sizeOriginal,
          mimeType: file.mimeType,
          createdAt: file.$createdAt,
          url: this.getFileUrl(bucketId, file.$id)
        }
      };

    } catch (error) {
      console.error('Appwrite Get File Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // List files in bucket
  async listFiles(bucketId = this.VOICE_BUCKET_ID, limit = 25) {
    try {
      const files = await this.storage.listFiles(bucketId, [], limit);

      return {
        success: true,
        data: {
          total: files.total,
          files: files.files.map(file => ({
            fileId: file.$id,
            filename: file.name,
            size: file.sizeOriginal,
            mimeType: file.mimeType,
            createdAt: file.$createdAt,
            url: this.getFileUrl(bucketId, file.$id)
          }))
        }
      };

    } catch (error) {
      console.error('Appwrite List Files Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create bucket (for setup)
  async createBucket(bucketId, name, permissions = []) {
    try {
      const bucket = await this.storage.createBucket(
        bucketId,
        name,
        permissions,
        false, // File security
        true,  // Enabled
        10485760, // 10MB max file size
        ['audio/wav', 'audio/mp3', 'audio/ogg', 'audio/webm', 'audio/mpeg'] // Allowed file types
      );

      return {
        success: true,
        data: bucket
      };

    } catch (error) {
      console.error('Appwrite Create Bucket Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new AppwriteService();
