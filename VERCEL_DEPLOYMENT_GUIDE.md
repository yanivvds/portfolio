# Vercel Deployment Guide - Secure Portfolio with OpenAI Integration

This guide will help you deploy your portfolio to Vercel while keeping your OpenAI API key secure on the server-side.

## 🔒 Security Overview

**Before Deployment:** Your OpenAI API key was exposed in the browser via `REACT_APP_OPENAI_API_KEY`
**After Deployment:** Your API key is securely stored as a Vercel environment variable and only accessible to server-side functions

## 📁 Project Structure Changes

```
portfolio/
├── api/                          # NEW: Vercel serverless functions
│   ├── chat.ts                  # Non-streaming OpenAI API handler
│   └── chat-stream.ts           # Streaming OpenAI API handler
├── src/
│   └── App.tsx                  # UPDATED: Now calls /api/* instead of OpenAI directly
├── vercel.json                  # NEW: Vercel configuration
└── package.json                 # UPDATED: Added @vercel/node dependency
```

## 🚀 Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Deploy to Vercel

```bash
# If not already logged in
vercel login

# Deploy the project
vercel --prod
```

### 3. Set Environment Variables in Vercel

After deployment, you need to set your OpenAI API key as a Vercel environment variable:

#### Option A: Via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your deployed project
3. Go to Settings → Environment Variables
4. Add a new variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key (starts with `sk-`)
   - **Environment:** Production, Preview, Development (select all)

#### Option B: Via Vercel CLI
```bash
# Set the environment variable
vercel env add OPENAI_API_KEY

# When prompted, enter your OpenAI API key
# Select: Production, Preview, Development

# Redeploy to apply the environment variable
vercel --prod
```

### 4. Remove Local Environment Variable

Since we're no longer using client-side API calls, you can remove the old environment variable from your local `.env` file:

```bash
# Remove this line from .env (if it exists)
# REACT_APP_OPENAI_API_KEY=sk-...
```

## 🔧 API Endpoints

Your deployed portfolio will have these secure API endpoints:

- **`/api/chat`** - Non-streaming OpenAI responses
- **`/api/chat-stream`** - Streaming OpenAI responses (for real-time typing effect)

## 📊 How It Works

### Before (Insecure)
```
Browser → OpenAI API (with exposed API key)
```

### After (Secure)
```
Browser → Your Vercel API → OpenAI API (with server-side API key)
```

## 🧪 Testing

### Local Testing
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Set up local environment
vercel env pull .env.local

# Start local development with serverless functions
vercel dev
```

### Production Testing
After deployment, test these endpoints:
- Visit your deployed site
- Try the chat functionality
- Check browser Network tab - you should see calls to `/api/chat` instead of `api.openai.com`

## 🔍 Verification Checklist

✅ **API Key Security**
- [ ] OpenAI API key is set as Vercel environment variable
- [ ] No `REACT_APP_OPENAI_API_KEY` in client-side code
- [ ] Browser Network tab shows calls to `/api/*` not `api.openai.com`

✅ **Functionality**
- [ ] Chat responses work correctly
- [ ] Streaming responses work (if using)
- [ ] Interactive elements render properly
- [ ] Error handling works (try with invalid input)

✅ **Performance**
- [ ] API responses are reasonably fast
- [ ] No CORS errors in browser console
- [ ] File search/vector store integration works

## 🚨 Troubleshooting

### Common Issues

**1. "API request failed: 500"**
- Check Vercel function logs: `vercel logs`
- Ensure `OPENAI_API_KEY` environment variable is set
- Verify API key is valid and has sufficient credits

**2. CORS Errors**
- Check `vercel.json` CORS headers configuration
- Ensure API routes return proper CORS headers

**3. "Function timeout"**
- OpenAI responses can be slow; increase timeout in `vercel.json`
- Current timeout is set to 30 seconds

**4. Environment Variable Not Found**
- Redeploy after setting environment variables: `vercel --prod`
- Check variable name is exactly `OPENAI_API_KEY` (not `REACT_APP_OPENAI_API_KEY`)

### Debug Commands

```bash
# View deployment logs
vercel logs

# Check environment variables
vercel env ls

# Test API endpoints locally
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "projectContext": null}'
```

## 🔄 Rollback Plan

If you need to rollback to the old client-side implementation:

1. Restore the old `getChatbotResponse` function in `App.tsx`
2. Add `REACT_APP_OPENAI_API_KEY` back to your environment
3. Remove the `/api` folder
4. Remove `vercel.json`

## 📈 Benefits of This Setup

1. **Security**: API key never exposed to browsers
2. **Performance**: Server-side caching and optimization
3. **Scalability**: Vercel's serverless functions auto-scale
4. **Monitoring**: Better error tracking and logging
5. **Cost Control**: Server-side rate limiting possible
6. **Compliance**: Better data privacy controls

## 🎯 Next Steps

After successful deployment, consider:

1. **Custom Domain**: Set up a custom domain in Vercel dashboard
2. **Analytics**: Add Vercel Analytics for usage insights
3. **Monitoring**: Set up error tracking (Sentry, etc.)
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Caching**: Add Redis or similar for response caching

## 📞 Support

If you encounter issues:
1. Check Vercel function logs: `vercel logs`
2. Review OpenAI API usage in your dashboard
3. Test API endpoints directly with curl/Postman
4. Check browser console for client-side errors

Your portfolio is now securely deployed with server-side OpenAI integration! 🎉
