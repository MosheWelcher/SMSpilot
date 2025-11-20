# SMSpilot (GroupMe - Copilot Bridge)

A Google Apps Script project that automates the connection between GroupMe and the "Copilot" user. 

This project features an **Automated Installer**. When you authenticate, the script will automatically:
1.  Create a new GroupMe group called **"SMSpilot"**.
2.  Create a **Bot** in that group pointed at this script.
3.  Save your **Access Token** and **Group ID** to the script properties.

## Files

  * **`GroupMeBridge.gs`**: Handles the messaging logic (filtering bots, tagging Copilot).
  * **`doGet.gs`**: The Auto-Installer. Handles the OAuth callback and provisions resources.
  * **`index.html`**: The UI for the installer.

-----

## Setup Instructions

### 1. Deploy Google Apps Script

1.  Create the project at [script.google.com](https://script.google.com/).
2.  Create `GroupMeBridge.gs`, `doGet.gs`, and `index.html` with the provided code.
3.  **Deploy**:
      * **Deploy** > **New deployment**.
      * Select type: **Web app**.
      * Execute as: **Me**.
      * Who has access: **Anyone**.
      * Click **Deploy**.
4.  **Copy the Web App URL**. This is your **Callback URL**.

### 2. Register GroupMe Application

1.  Go to [dev.groupme.com/applications](https://dev.groupme.com/applications).
2.  Click **Create Application**.
3.  **Callback URL**: Paste your **Web App URL** from Step 1.
4.  Click **Submit**.

### 3. Run the Installer

1.  In the **Applications** list on `dev.groupme.com`, click your new application (SMSpilot).
2.  Click the **OAuth URL** (Authorization link) provided in the details section.
3.  **Authorize** the application if prompted.
4.  You will be redirected to your Web App.
5.  **Watch the screen**: The script will display a checklist as it automatically creates the group, registers the bot, and saves your configuration.

### Usage

Once the installer finishes (showing all green checkmarks):
1.  Open the newly created **"SMSpilot"** group in your GroupMe app.
2.  Send a message: `Hello`.
3.  The bot will reply: `@Copilot Hello`.
