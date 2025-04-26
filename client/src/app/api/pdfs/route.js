import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const pdfsDirectory = path.join(process.cwd(), 'public', 'pdfs')
    const files = await fs.readdir(pdfsDirectory)
    
    const pdfFiles = files
      .filter(file => file.endsWith('.pdf'))
      .map((file, index) => ({
        id: index + 1,
        filename: file,
        updatedAt: new Date().toISOString()
      }))

    return Response.json(pdfFiles)
  } catch (error) {
    console.error('Error reading PDF directory:', error)
    return Response.json([], { status: 500 })
  }
} 