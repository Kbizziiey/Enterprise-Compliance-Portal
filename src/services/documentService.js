import { apiClient } from '../api/apiClient.js'

/**
 * Converts a browser File object to a Base64 string (no data: prefix),
 * which is what the Apps Script backend expects for Drive uploads.
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const documentService = {
  async listDocuments() {
    return apiClient.call('listDocuments')
  },

  async search(query, filters = {}) {
    return apiClient.call('search', { query, ...filters })
  },

  async upload(files, metadata, onProgress) {
    const total = files.length
    let completed = 0

    const encoded = []
    for (const file of files) {
      const base64 = await fileToBase64(file)
      encoded.push({ fileName: file.name, mimeType: file.type, base64 })
      completed += 1
      if (onProgress) onProgress(Math.round((completed / total) * 100))
    }

    return apiClient.call('upload', { files: encoded, ...metadata })
  },

  async deleteDocument(id) {
    return apiClient.call('deleteDocument', { id })
  },

  async getDashboardStats() {
    return apiClient.call('dashboard')
  },

  async getAuditLogs() {
    return apiClient.call('auditLogs')
  }
}
