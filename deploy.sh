#!/bin/bash

# Vercel Deployment Script for Portfolio
# This script helps deploy your portfolio securely to Vercel

echo "🚀 Portfolio Deployment Script"
echo "=============================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please log in to Vercel:"
    vercel login
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if OPENAI_API_KEY environment variable is set in Vercel
echo "🔑 Checking environment variables..."
if ! vercel env ls | grep -q "OPENAI_API_KEY"; then
    echo "⚠️  OPENAI_API_KEY not found in Vercel environment variables."
    echo "Please set your OpenAI API key:"
    echo ""
    echo "Option 1: Via CLI (recommended)"
    echo "  vercel env add OPENAI_API_KEY"
    echo ""
    echo "Option 2: Via Dashboard"
    echo "  1. Go to https://vercel.com/dashboard"
    echo "  2. Select your project → Settings → Environment Variables"
    echo "  3. Add OPENAI_API_KEY with your API key"
    echo ""
    read -p "Have you set the OPENAI_API_KEY environment variable? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Please set the environment variable and run this script again."
        exit 1
    fi
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Check deployment status
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🔗 Your portfolio is now live!"
    echo "🔒 OpenAI API key is securely stored server-side"
    echo ""
    echo "Next steps:"
    echo "1. Test the chat functionality on your live site"
    echo "2. Check browser Network tab - you should see calls to /api/chat"
    echo "3. Verify no OpenAI API key is visible in browser"
    echo ""
    echo "📊 Monitor your deployment:"
    echo "  vercel logs"
    echo ""
    echo "🔧 Update environment variables:"
    echo "  vercel env add VARIABLE_NAME"
    echo ""
else
    echo "❌ Deployment failed. Check the error messages above."
    echo ""
    echo "Common solutions:"
    echo "1. Ensure you're logged in: vercel login"
    echo "2. Check your internet connection"
    echo "3. Verify project structure is correct"
    echo ""
    exit 1
fi
