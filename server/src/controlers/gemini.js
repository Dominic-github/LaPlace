import { GoogleGenerativeAI } from '@google/generative-ai'

class GeminiController {
  constructor() {
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }
}

export default new GeminiController()
