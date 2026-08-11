#!/usr/bin/env bash

# ==========================================================================
# RoamingBuddy - Google Cloud Platform (GCP) Global Cloud Run Deployment
# GCP Project ID: mydrproject-317504
# Services: roamingbuddy-agents (Backend) & roamingbuddy-web (Frontend)
# ==========================================================================

set -e

GCP_PROJECT_ID=${1:-"mydrproject-317504"}
GCP_REGION=${2:-"us-central1"}

BACKEND_SERVICE="roamingbuddy-agents"
BACKEND_IMAGE="gcr.io/${GCP_PROJECT_ID}/${BACKEND_SERVICE}:latest"

FRONTEND_SERVICE="roamingbuddy-web"
FRONTEND_IMAGE="gcr.io/${GCP_PROJECT_ID}/${FRONTEND_SERVICE}:latest"

echo "🚀 Starting Native GCP Deployment for RoamingBuddy..."
echo "📍 GCP Project ID: ${GCP_PROJECT_ID}"
echo "🌏 GCP Region: ${GCP_REGION}"

# 1. Set Active GCP Project
echo "🔐 Configuring GCP Project..."
gcloud config set project "${GCP_PROJECT_ID}"

# 2. Enable Required GCP APIs
echo "🛠️ Enabling GCP APIs..."
gcloud services enable \
  run.googleapis.com \
  containerregistry.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  pubsub.googleapis.com \
  secretmanager.googleapis.com

# 3. Build & Deploy Backend Agents Microservices
echo "📦 Building & Deploying Backend Microservices (${BACKEND_SERVICE})..."
gcloud builds submit . --config=cloudbuild.yaml

gcloud run deploy "${BACKEND_SERVICE}" \
  --image "${BACKEND_IMAGE}" \
  --platform managed \
  --region "${GCP_REGION}" \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 1Gi \
  --cpu 1

# 4. Build & Deploy Frontend Web Application
echo "🌐 Building & Deploying Frontend Web Application (${FRONTEND_SERVICE})..."
gcloud builds submit . --config=cloudbuild-web.yaml

gcloud run deploy "${FRONTEND_SERVICE}" \
  --image "${FRONTEND_IMAGE}" \
  --platform managed \
  --region "${GCP_REGION}" \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1

echo "✅ GCP Native Cloud Run Deployment Completed Successfully!"
