# Prompt Evaluator

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml) [![Container image](https://github.com/OWNER/REPO/packages/container/prompt-evaluator/badge.svg)](https://github.com/OWNER/REPO/pkgs/container/prompt-evaluator)

A lightweight prompt quality evaluator built with Node.js, Express, and GitHub Copilot.

## Features

- Rule-based prompt evaluation
- Criteria scoring for clarity, specificity, context, structure, and actionability
- Suggestions and feedback
- Optional AI-powered evaluation route
- Simple web UI
- Docker-enabled

## Setup

1. Clone the repo
2. Run `npm install`
3. Copy `.env.example` to `.env` and add `OPENAI_API_KEY` if using AI evaluation
4. Run `npm run dev`

## API Endpoints

- `POST /api/evaluate/basic`
- `POST /api/evaluate/ai`
- `POST /api/evaluate/compare`

## Docker

Build and run:

```bash
docker build -t prompt-evaluator .
docker run -p 3000:3000 --env OPENAI_API_KEY=$OPENAI_API_KEY prompt-evaluator
```

## Azure Deployment

This repo includes a GitHub Actions workflow that deploys the app to Azure App Service on every push to `main`.

Required GitHub secrets:
- `AZURE_WEBAPP_NAME`: the name of your Azure App Service
- `AZURE_WEBAPP_PUBLISH_PROFILE`: the publish profile XML from Azure

To deploy:
1. Create an Azure Web App for Linux with Node.js or a plain web app.
2. Download the publish profile from the Azure portal.
3. Add the publish profile XML as the `AZURE_WEBAPP_PUBLISH_PROFILE` secret in GitHub.
4. Add your Azure app name as the `AZURE_WEBAPP_NAME` secret.
5. Push to `main` and the workflow will deploy the app.
