# Yaniv van der Stigchel - Portfolio 🚀

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)

## About

This is my personal portfolio website showcasing my work as an AI Engineer and Bachelor's student in Artificial Intelligence at the University of Amsterdam (UvA).

## Features

✅ Responsive design & mobile-friendly
✅ Supports both dark and light modes
✅ Modern glass-morphism design
✅ Interactive chatbot assistant
✅ Contact cards with direct links
✅ Timeline of career and education
✅ Skills showcase with categorized expertise

## Technologies Used

- React 18 with TypeScript
- SCSS for styling
- Material-UI components
- Responsive design principles
- Modern JavaScript (ES6+)

## Quick Setup

1. Ensure you have [Node.js](https://nodejs.org/) installed. Check your installation by running:

    ```bash
    node -v
    ```

2. In the project directory, install dependencies:

    ```bash
    npm install
    ```

3. **For development with AI chat functionality:**

    ```bash
    npm run dev:full
    # or directly:
    npx vercel dev
    ```
    This uses Vercel's development server to run both the React app and API functions locally.

4. **For development without API (frontend only):**

    ```bash
    npm start
    ```
    This runs only the React app - API calls will fail in development mode.

5. Open [http://localhost:3000](http://localhost:3000) to view the portfolio in the browser.

## 🤖 AI Chat Features

The portfolio includes an AI-powered chatbot that uses OpenAI's GPT-4 to provide intelligent responses about projects and background. The chat system includes:

- **Interactive Discussions**: Ask questions about specific projects or technical background
- **Smart Context Awareness**: Responses are tailored based on the project context
- **Contact Integration**: Direct links to contact methods when appropriate
- **Follow-up Suggestions**: Intelligent suggestions for next questions
- **Streaming Support**: Real-time response streaming for better UX

### API Configuration

The chat functionality uses Vercel serverless functions. To enable the AI features:

1. **Get an OpenAI API key** from [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. **Set environment variables** in your Vercel project:
   - `OPENAI_API_KEY`: Your OpenAI API key
3. **Deploy to Vercel** to enable the serverless API endpoints

### Troubleshooting

**"vercel dev must not recursively invoke itself" Error:**
- Use `npx vercel dev` instead of `npm run dev:full`
- Or run: `npm run dev:full` (uses the renamed script)
- This error occurs when npm scripts conflict with Vercel's internal configuration

## Deployment

You can choose your preferred service (e.g., [Netlify](https://www.netlify.com/), [Render](https://render.com/), [Heroku](https://www.heroku.com/)) for deployment. One of the easiest ways to host this portfolio is using GitHub Pages. Follow the instructions below for a production deploy.

1. **Set Up GitHub Repository**

    Create a new repository on GitHub for your portfolio app.

2. **Configure `package.json`**

    Edit the following properties in your `package.json` file:

    ```json
    {
        "homepage": "https://yourusername.github.io/your-repo-name",
        "scripts": {
            "predeploy": "npm run build",
            "deploy": "gh-pages -d build",
            ...
        }
    }
    ```

    Replace `yourusername` with your GitHub username and `your-repo-name` with the name of your GitHub repository.

3. **Deploy to GitHub Pages**

    Run the following command to deploy your app:

    ```bash
    npm run deploy
    ```

4. **Access Your Deployed App**

    After successfully deploying, you can access your app at `https://yourusername.github.io/your-repo-name`.