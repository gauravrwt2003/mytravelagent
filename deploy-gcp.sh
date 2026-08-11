#!/usr/bin/env bash

# ==========================================================================
# RoamingBuddy - Google Cloud Platform (GCP) Global Deployment Script
# GCP Project ID: mydrproject-317504
# Scope: Global Cloud CDN + Multi-Region Cloud Run
# ==========================================================================

set -e

GCP_PROJECT_ID=${1:-"mydrproject-317504"}
GCP_REGION=${2:-"us-central1"} # Primary Cloud Run Region with Global CDN Routing
SERVICE_NAME="roamingbuddy-agents"
IMAGE_TAG="gcr.io/${GCP_PROJECT_ID}/${SERVICE_NAME}:latest"

echo "🚀 Starting Global GCP Deployment for RoamingBuddy..."
echo "📍 GCP Project ID: ${GCP_PROJECT_ID}"
echo "🌐 Global Scope: Cloud CDN Edge Network + Multi-Region Cloud Run"

# 1. Set Active GCP Project
echo "🔐 Configuring GCP Project..."
gcloud config set project "${GCP_PROJECT_ID}"

# 2. Enable Required GCP APIs
echo "🛠️ Enabling GCP APIs (Cloud Run, Container Registry, Vertex AI, Pub/Sub)..."
gcloud services enable \
  run.googleapis.com \
  containerregistry.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  pubsub.googleapis.com \
  secretmanager.googleapis.com

# 3. Build & Push Container Image to Google Container Registry
echo "📦 Building & Pushing Cloud Run Container Image..."
gcloud builds submit --tag "${IMAGE_TAG}" -f packages/core/Dockerfile .

# 4. Deploy Backend Agents Microservices to GCP Cloud Run
echo "☁️ Deploying Agents Microservices to GCP Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_TAG}" \
  --platform managed \
  --region "${GCP_REGION}" \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 1Gi \
  --cpu 1

# 5. Build Web Frontend & Deploy Globally to Firebase Hosting + Cloud CDN
echo "🌐 Building Web Frontend Production Bundle..."
npm run build --workspace=packages/web

echo "🔥 Deploying Frontend to Global Firebase Hosting Edge CDN..."
npx firebase-tools deploy --only hosting --project "${GCP_PROJECT_ID}"

echo "✅ Global GCP Deployment Completed Successfully!"
echo "🌐 Global Web Application URL: https://${GCP_PROJECT_ID}.web.app"
