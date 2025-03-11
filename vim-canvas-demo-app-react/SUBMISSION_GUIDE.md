# Submitting Your ScribeAI VIM Canvas App for Review

This guide provides instructions for submitting your ScribeAI VIM Canvas application for review on getvim.com.

## Prerequisites

1. Your application is deployed to Heroku (or another hosting platform)
2. You have a getvim.com account with developer access

## Submission Steps

### 1. Prepare Your Application Information

Before submitting, gather the following information:

- **Application Name**: ScribeAI
- **Application Description**: A medical transcription and documentation platform for healthcare professionals
- **Application URL**: Your Heroku deployment URL (e.g., https://your-app-name.herokuapp.com)
- **Application Icon**: A square SVG image with transparent background
- **Launch Endpoint**: `/api/launch` (already configured in the application)
- **Token Endpoint**: `/api/token` (already configured in the application)

### 2. Submit for Review on getvim.com

1. Log in to your getvim.com developer account
2. Navigate to the Developer Dashboard
3. Click "Submit New Application"
4. Fill in the application details using the information gathered above
5. Upload your application icon
6. Enter your application URL and endpoints
7. Submit for review

### 3. Testing Your Application

Before submitting, ensure your application works correctly with the VIM integration:

1. The application should authenticate users through VIM
2. The ScribeAI integration should work properly
3. All features should function as expected

### 4. After Submission

- Monitor your developer dashboard for updates on your application review
- Be prepared to make changes if requested by the review team
- Once approved, your application will be available in the VIM marketplace

## Common Issues and Solutions

### Authentication Issues

If you encounter authentication issues:

1. Verify your CLIENT_ID and CLIENT_SECRET are correct
2. Ensure your REDIRECT_URL matches your deployed application URL
3. Check the Heroku logs for any authentication errors

### Deployment Issues

If your application is not working correctly on Heroku:

1. Check the Heroku logs using `heroku logs --tail`
2. Verify all environment variables are set correctly
3. Ensure the application builds and runs without errors

## Contact Support

If you need assistance with your submission, contact the VIM developer support team at support@getvim.com. 