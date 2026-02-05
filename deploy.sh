#!/bin/bash
set -e

# Project Configuration
PROJECT_ID="med-gemma-486103"
REGION="us-central1"
SERVICE_NAME="home-doc"
REPO_NAME="home-doc-repo"
IMAGE_NAME="home-doc-image"

echo "🚀 Starting Deployment for $SERVICE_NAME..."

# 1. Enable Required Services
echo "🔧 Enabling Google Cloud APIs..."
gcloud services enable run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    --project $PROJECT_ID

# 2. Create Artifact Registry Repository (if not exists)
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION --project=$PROJECT_ID > /dev/null 2>&1; then
    echo "📦 Creating Artifact Registry Repository..."
    gcloud artifacts repositories create $REPO_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Docker repository for HomeDoc" \
        --project=$PROJECT_ID
else
    echo "✅ Artifact Registry configured."
fi

# 3. Build & Push Image using Cloud Build
IMAGE_PATH="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME"
echo "🔨 Building Container Image: $IMAGE_PATH"
# We submit the build to Cloud Build to avoid needing local Docker
gcloud builds submit --tag $IMAGE_PATH --project $PROJECT_ID

# 4. Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
# Extract Env Vars from .env.local for deployment
# We map them to comma-separated list KEY=VALUE,KEY2=VALUE2
# Note: In production you should use Secret Manager, but this is fine for demo
ENV_VARS=$(grep -v '^#' .env.local | grep -v '^$' | tr '\n' ',' | sed 's/,$//')

gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_PATH \
    --region $REGION \
    --project $PROJECT_ID \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars "$ENV_VARS"

echo "✅ Deployment Complete! Info above."
