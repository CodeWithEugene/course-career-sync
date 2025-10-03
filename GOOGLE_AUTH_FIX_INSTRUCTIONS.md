# How to Fix Google Authentication

The current authentication issue is likely caused by a misconfiguration in your Google Cloud project's OAuth 2.0 Client ID settings. Follow these steps to resolve it.

## 1. Go to Google Cloud Console

Open your web browser and navigate to the [Google Cloud Console Credentials page](https://console.cloud.google.com/apis/credentials).

## 2. Select Your Project

Make sure you have selected the correct project from the project dropdown at the top of the page. This should be the project where you created your OAuth 2.0 Client ID.

## 3. Edit the OAuth 2.0 Client ID

- In the "OAuth 2.0 Client IDs" section, find the client ID you are using in your `.env` file.
- The ID is: `117053563877-pdor1rav4e9kgrea7p21e31h999q7tfj.apps.googleusercontent.com`.
- Click the pencil icon (edit) next to that client ID.

## 4. Add Authorized JavaScript Origin

- This is the most critical step. The Google Sign-In library will not work if the origin of the request is not authorized.
- Find the section named **"Authorized JavaScript origins"**.
- Click **"+ ADD URI"**.
- Enter the URI for your local development server: `http://localhost:8080`
- It is important to use `http` and not `https` for localhost unless you are running a secure server.

## 5. (Optional but Recommended) Add Authorized Redirect URI

- While the current popup-based flow doesn't strictly require a redirect URI, it is good practice to have it configured.
- Find the section named **"Authorized redirect URIs"**.
- Click **"+ ADD URI"**.
- Enter the same URI: `http://localhost:8080`

## 6. Save Your Changes

- Scroll to the bottom of the page and click the **"Save"** button.
- It may take a few minutes for the changes to propagate through Google's systems.

## 7. Restart and Test

After waiting a few minutes, restart your development server and try signing in again. The Google authentication popup should now appear.
