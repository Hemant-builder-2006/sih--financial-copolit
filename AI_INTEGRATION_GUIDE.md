# 🤖 AI Integration Setup Guide

This guide shows you how to set up secure Google Gemini AI integration with your React Flow canvas.

## 🔧 Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in your project root:

```bash
# Google Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Get your API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it into your `.env.local` file

### 2. Security Notes

- ✅ **NEVER** commit `.env.local` to git
- ✅ The API key stays server-side only
- ✅ Frontend cannot access the key
- ✅ Mock responses work without the key for development

## 📋 API Endpoint Details

### Endpoint: `/api/ai`

**Method:** POST

**Request Body:**
```json
{
  "prompt": "Your text content here",
  "action": "analyze"
}
```

**Available Actions:**
- `analyze` - Detailed analysis of content
- `summarize` - Concise summary
- `expand` - Expanded version with more details
- `improve` - Suggestions for improvement

**Response Format:**
```json
{
  "result": "AI generated response..."
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## 🎯 Model Fallback Strategy

The API automatically tries models in this order:
1. **Gemini 2.5 Flash** (fastest, most cost-effective)
2. **Gemini 2.0 Pro** (fallback)
3. **Gemini 1.5 Pro** (final fallback)

## 🚀 Frontend Integration

### AI Node Usage

1. **Input your content** in the textarea
2. **Choose an action** (Analyze, Summarize, Expand, Improve)
3. **Click the button** to process
4. **View results** in the response area

### Example Fetch Call

```typescript
// Example: How the AI Node calls the API
const response = await fetch('/api/ai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    prompt: userInput, 
    action: 'summarize' 
  }),
});

const data = await response.json();
if (data.result) {
  setAiResponse(data.result);
} else {
  console.error('AI Error:', data.error);
}
```

## 🛡️ Error Handling

### Client-Side Errors

- **Network issues** - Shows connection error
- **Invalid input** - Validates prompt is not empty
- **API errors** - Displays error message to user

### Server-Side Errors

- **Missing API key** - Returns mock response for development
- **Rate limiting** - Returns 429 status with retry message
- **Invalid model** - Falls back to available models
- **Authentication** - Returns 401 with clear error message

## 🧪 Development Mode

**Without API Key:**
- Returns realistic mock responses
- No actual API calls made
- Perfect for development and testing
- Responses simulate real AI behavior

**Mock Response Example:**
```
Mock analyze completed for: "Your content here"

This is a simulated AI response since no API key is configured. 
The AI would normally analyze your content and provide detailed 
insights, analysis, or transformations based on your request.
```

## 📊 Usage Examples

### 1. Content Analysis
```
Input: "Our new product features advanced AI capabilities"
Action: analyze
Result: Detailed analysis of the product description, tone, and marketing effectiveness
```

### 2. Text Summarization
```
Input: "Long article about market trends..."
Action: summarize
Result: Concise bullet points of key findings
```

### 3. Content Expansion
```
Input: "AI is transforming business"
Action: expand
Result: Detailed exploration of AI's impact across industries
```

### 4. Content Improvement
```
Input: "Basic product description"
Action: improve
Result: Enhanced version with better structure and persuasive language
```

## 🔍 Troubleshooting

### Common Issues

1. **"API key not found"**
   - Check `.env.local` exists in project root
   - Verify `GEMINI_API_KEY` is set correctly
   - Restart your development server

2. **"Model not available"**
   - API automatically falls back to available models
   - Check Google AI Studio for model availability

3. **"Rate limit exceeded"**
   - Wait a few minutes before trying again
   - Consider upgrading your Gemini API plan

4. **Mock responses only**
   - This is normal without an API key
   - Add your API key to `.env.local` for real AI responses

### Testing the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open the React Flow canvas**

3. **Add an AI Node**

4. **Enter some test content:**
   ```
   "Artificial intelligence is revolutionizing how we work and live."
   ```

5. **Click "Analyze"** and verify you get a response

## 🎉 Success!

You now have a secure, production-ready AI integration that:
- ✅ Uses Google Gemini's latest models
- ✅ Keeps API keys secure on the server
- ✅ Provides graceful error handling
- ✅ Works in development mode without setup
- ✅ Supports multiple AI actions
- ✅ Automatically falls back between models

Your AI Nodes can now provide real intelligence powered by Google's state-of-the-art language models!