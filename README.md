# Quizable

Quizable is an open-source web quiz app designed to enhance interactive learning and research. It is seamless, simple, yet extremely effective, making it the ideal tool for conducting quizzes. Quizable is different from its competition thanks to its frictionless login setup and the ability to create and play quizzes immediately. Some of the features worth mentioning: frictionless login, importing and exporting quizzes in JSON format, joining a quiz session by inserting a code or scanning a QR code, answer statistics and a leaderboard while playing a quiz, generating a report of a played quiz (detailed analysis of participants' responses etc.), and the ability to reconnect to a previous session.

# How to Run and Deploy the App

## Prerequisites

### Must-Have

- **Google Account**: you need a Google Account to be able to sign in to Firebase.
- **Internet Connection**: ensure you have a stable internet connection.
- **Node.js**: you need Node.js to use npm to install all necessary dependencies. For help: [How to Install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs).
- **Any CLI**: you need any Command Line Interface to perform actions with text commands.
- **Git**: to track the version changes, to make collaboration easier, etc. For help: [Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

### Nice-to-Have

- **An IDE**: to facilitate the process of managing the app. For example: [How to Install Visual Studio Code on Windows](https://www.geeksforgeeks.org/how-to-install-visual-studio-code-on-windows/).

## Step by Step

### 1. Pulling the Project from GitHub

1. **Navigate to a folder**: Open any preferred terminal and navigate to your folder where you would like your project to be in. This can be done using the "cd" command.
   > Tip: On **Windows**, you can go to any folder and in the Path input, type `powershell`  (it will overwrite the current path). This will open up the terminal with the path of the folder.
2. **Clone the repository**: First, you need to clone the repository to your local machine. This is done using the `git clone` command followed by the repository's URL:

   ```bash
   git clone https://github.com/kkatharinaa/quizable.git
   ```

   If you encounter this error:

   ```bash
   git : the term 'git' is not recognized as the name of a cmdlet, function, script file, or operable program. check the spelling of the name, or if a path was included, verify that the path is correct and try again. at line:1 char:1
   ```

   then follow this tutorial to troubleshoot: [Troubleshooting Git Error](https://www.youtube.com/watch?v=h6xnrdn5sQc).
3. **Move to the main folder of the project**: You need to move to the main folder of `quizable`, as the whole project is located there, and all dependencies must be installed there. To move to the main folder of the project, enter this command in the terminal:

   ```bash
   cd quizable
   ```

### 2. Access Firebase Console

1. Open your web browser and go to the Firebase Console.
2. Sign in with your Google Account.

### 3. Create and Set Up a New Project in Firebase

1. **Create a new Firebase project**: Once you're signed in to your Firebase account, navigate to the dashboard. Look for the **"Add project"** button or select **"Create a project"**.
2. **Enter project details**: In the **"Create a project"** dialog, you'll see a field labelled **"Project name"**. Here, you should enter a descriptive name for your project. Then, click on the **"Continue"** button to proceed.
3. **Enable Google Analytics**: You’ll have the option to enable Google Analytics for your project. Make sure to enable this option by checking **“Enable Google Analytics for this project”** option.
4. **Create the project**: Once you've configured the project details and enabled Google Analytics, click on the **"Create project"** button to finalize the setup.
5. **Configure Firebase for web**: After your project is created, Firebase will prompt you to set up your project for the web. Click on the **"Web"** option to proceed.

   ![Firease figure 1](doc/img/firebase1.png)

6. **Register your app**: You'll need to specify a nickname for your web app. Additionally, ensure that **"Also set up Firebase Hosting for this app"** option is unchecked, as we'll focus on Firestore Database setup for now. Then click on **"Register app"**.
7. **Skip the next few steps**: Skip the steps **"Add Firebase SDK"**, **"Install CLI"** and **"Deploy to Firebase Hosting"** by clicking **Next** and **Continue to console**. We will do these steps later on.
8. **View Firebase configuration**: Press on the Cog Wheel next to **Project Overview**>**Project settings** and scroll down to find your Firebase configuration details. These include API keys and other credentials necessary for integrating Firebase with your application. Make sure to keep this information secure.
9. **Set up Firestore Database**: Now, let's configure Firestore Database. On the left sidebar of the Firebase console, locate the **"Build"** section. Under it, select **"Firestore Database"** to begin setting up your database.

   ![Firease figure 2](doc/img/firebase2.png)

10. **Create a new database**: Press the **"Create database"** button. You'll be prompted to choose a location for your database. Select your preferred location and then click **"Next"**.
11. **Configure database security**: In the next window, you'll see options for setting up database security rules. For simplicity, toggle **"Start in test mode"** and then click **"Enable"**.
12. **Create collection**: Now, create a collection by pressing **"+ Start collection"** to organize your data.
13. **Create a document**: For Collection ID, name it **“users”**. For the Document ID, select **"Auto-ID"** to automatically generate a unique ID for each document. Add a field with any name and value to the document, then press **"Save"**.
14. **Turn on Authentication**: To add an Authentication method, navigate to the **“Authentication”** section and click on **Get started**. Then, head to the sign-in method and select **“Email/Password”**. Enable **“Email/Password”** and **“Email link (passwordless sign-in)”**, then click on **"Save"**.

   ![Firease figure 3](doc/img/firebase3.png)

### 4. Setting Up Firebase in Code

1. **Open the app in Visual Studio Code**: To begin, launch Visual Studio Code on your computer. If you haven't already installed it, you can download it from the official website and follow the installation instructions for your operating system.
2. **Install dependencies**: In Visual Studio Code, open the integrated terminal. This can be accessed by pressing `Ctrl + "backtick"` (backtick: `). Once the terminal is open, type the following command:

   ```bash
   npm install
   ```

   This command will install all the necessary dependencies for your project. If you encounter an error related to a lack of permission, enter these commands in the VS Code terminal:

   ```bash
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   Get-ExecutionPolicy
   ```

3. **Install Firebase tools globally**: In the same terminal, enter the following command:

   ```bash
   npm install -g firebase-tools
   ```

   This command allows you to use these tools from any directory.
4. **Create a configuration file**: Within your project directory, create a file named `.env`. This file will store sensitive information like API keys and other credentials. The file should be located alongside the `package.json` file, so in the root of the entire project.
5. **Add Firebase credentials to .env file**: Open the `.env` file in VS Code and add the following code, replacing the values with the actual credentials from your **Project Settings** tab of your project (See **3. Create and Set Up a New Project in Firebase** > **8. View Firebase configuration**).

   ```bash
   VITE_API_KEY=<YOUR_API_KEY_FROM_FIREBASE>
   VITE_AUTH_DOMAIN=<YOUR_AUTH_DOMAIN_FROM_FIREBASE>
   VITE_PROJECT_ID=<YOUR_PROJECT_ID_FROM_FIREBASE>
   VITE_STORAGE_BUCKET=<YOUR_STORAGE_BUCKET_FROM_FIREBASE>
   VITE_MESSAGIN_SENDER_ID=<YOUR_MESSAGIN_SENDER_ID_FROM_FIREBASE>
   VITE_APP_ID=<YOUR_APP_ID_FROM_FIREBASE>
   EMAIL_SMTP="smtp.google.com"
   EMAIL_PORT="587"
   EMAIL_ADDRESS=<YOUR_OWN_GMAIL_ADDRESS>
   EMAIL_PASSWORD=<YOUR_OWN_GMAIL_PASSWORD>
   ```

   Alternatively, another email service can be used, but then the SMTP and port have to be adjusted. If you decide to go with a GMAIL address, you might have to generate an [app password](https://myaccount.google.com/apppasswords).
6. **Change value of "default" to your project id**: In `.firebaserc` file, change the value of the `default` field to match the name of your Firebase project. This value should be the same as `VITE_PROJECT_ID` you entered earlier. By doing this the code knows which Firebase project to use from your Firebase account.

7. **Login to Firebase**: Log in to your Firebase account using the Firebase CLI. In the terminal, type:

   ```bash
   firebase login
   ```

   Follow the prompts to log in with your Firebase credentials. This step is necessary to deploy your project to Firebase.

### 5. Deploy the App to Google Cloud

1. **Set up GCP project**: Navigate to the Google Cloud Platform (GCP) Console at [this link](https://console.cloud.google.com). Select **"Create project"** and provide a unique name for your project. Remember this name for future reference.

   ![Google Cloud figure 1](doc/img/gcloud.png)

2. **Enable billing (Free Tier)**: In the GCP Console, navigate to **"try for free"** and click **"Enable Billing"**. Google will require you to verify your identity, but don't worry, you won't be charged unless you exceed the free tier limits.
3. **Install Google Cloud SDK**: The Google Cloud SDK is a command-line tool (gcloud) used to manage GCP resources. Follow the official installation guide provided for your operating system at [this link](https://cloud.google.com/sdk/docs/install).
4. **Link project to your GCP account**: After the installation of Google cloud SDK, authenticate with GCP by running the following command in your terminal:

   ```bash
   gcloud auth login
   ```

   This links your project to your GCP account.
5. **Add Permissions to your project**: Go back to the Google Cloud page and navigate to **“Navigate Menu”** and select **"IAM"** and **"admin"**.

   ![aGoogle Cloud figure 2](doc/img/gcloud1.png)

6. **Select "Service Accounts" and then Click of “+ Create Service Account"**: In the first section called **"Service account details"**, press on the reload button to the right of the "Service Account ID" to generate a new service account id. Then, click on **Create and Continue**, and grant the following roles by clicking on **"+ Add another role"**:

   - “Owner”
   - “Cloud run admin”
   - “Service Account User”
   - “Artifact Registry Writer”

   To save the roles, please click on **"done"**.
7. **Enabling GCP services**: Now in the homepage enter **“Cloud build”** in the search bar, and in “Cloud build”, click on **“Settings”** and enable **“Cloud run”** and **“Service Accounts”**.

   ![Google Cloud figure 3](doc/img/gcloud2.png)

8. **Enable Cloud Run Admin API**: In the Google Cloud Console, Open the menu and select **API & Services**. Look for **Cloud Run Admin API**, select it and click on the blue **Enable** button. This will allow you to deploy the backend as a containerized app.

9. **Add Gcloud info to .env file**: In order to deploy this project to Google Cloud we need to input the values of:
   - GCLOUD_PROJECT_NAME=<PROJECT_NAME_FROM_GCLOUD_DASHBOARD>
   - GCLOUD_PROJECT_ID=<PROJECT_ID_FROM_GCLOUD_DASHBOARD>
   - GCLOUD_PROJECT_REPO_NAME=quizapp-repo
   - GCLOUD_PROJECT_REGION=europe-central2

   ![Google Cloud figure 4](doc/img/gcloud3.png)

10. **Set Your Project ID**: Before deploying your project to Cloud Run, ensure you've set the correct Google Cloud project. You can do this using the following command:

   ```bash
   gcloud config set project <your_project_id_from_gcloud>
   ```

   Replace `<your_project_id_here>` with the value of GCLOUD_PROJECT_ID from the environment `.env` file in the previous step. This command ensures that all subsequent commands will be executed within the context of your specified project.

11. **Create docker image registry in the Artifact Registry**: Before you deploy your project, you need to create a Docker Image Repository in the Artifact Registry. Navigate to the Google Cloud Console, click on the menu icon in the top-left and select **Artifact Registry** (or you can search for it in the top search bar). In the Artifact Registry Page, click on **+ Create Repository**. Set these values in the create dialog page:

- Name: ****
- Format: **Docker**
- Mode: **Standard**
- Location type: **Region**
- Region: **europe-central2**

   Leave the rest of the properties untouched/unchange and click on **Create**.

### 6. Deploy Your Project with Cloud Build

Deploy the backend using this command:

   ```bash
   npm run deploy-backend
   ```

Copy the URL from the output of this command where it says **Service URL:** and add this value in the `.env`file:

   ```bash
   VITE_API_URL=<SERVICE_URL_OF_NEWLY_DEPLOY_GCLOUD_PROJECT>
   ```

### 7. Deploy the web to Firebase

To deploy the app to firebase, run the following command:

   ```bash
   npm run deploy-frontend
   ```

# Limitations of Services

## Firebase

### Firebase for Free (Spark Plan)

Firebase offers a free tier, the Spark Plan, which is perfect for testing the waters or building small projects.

### Storage and Data Transfer

- **Storage**: you get 1 Gigabyte (GB) of space for all your app's data, including text, images and anything else you store in Firebase.
- **Data transfer**: the Spark Plan allows 10 GB of data transfer per month. This means users can download or access information from your app up to this limit.

### Database Operations

Firebase uses a powerful database called Firestore. Here's how many daily operations you can perform for free:

- **Reads**: 50,000 operations per day.
- **Writes**: 20,000 operations per day (adding or modifying data in the database).
- **Deletes**: 20,000 operations per day.

### What Happens If You Exceed Limits?

If your app surpasses the Spark Plan's limits, a couple of things might occur:

- **Performance throttling**: Firebase might slow down your app to prevent crashes.
- **Upgrade encouragement**: if you consistently exceed limits, Firebase will suggest upgrading to a paid plan for more storage, transfer and database actions.

### The Spark Plan is Ideal for

- **Getting started**: it's great for small project like our app.
- **Low-Traffic apps**: if you don't expect a large user base or frequent app usage, the free tier might suffice.
- **Pro tip**: monitor your usage.

Keep an eye on your Firebase usage through the Firebase console. This helps you determine how close you are to reaching the limits and decide if upgrading is necessary.

## Google Cloud

### Google Cloud Free Trial

Google Cloud offers a free trial period lasting 3 months, You get $300 in credit to use towards any GCP service. Once the credit runs out, the trial ends. This trial allows you to evaluate a comprehensive suite of services, ideal for getting started with cloud computing without initial financial commitment.

Each service within the trial comes with its own free tier limitations. These limitations are designed to provide a basic understanding of the service's functionalities without incurring costs.

### What Happens If You Exceed Limits?

If your usage surpasses the free tier limits for any service, you will begin to accrue charges based on the specific pricing tier and usage limits you reach.

### The Free Trial is Ideal for

The free trial is particularly valuable for:

- **Prototyping and development**: Utilize the trial for building prototypes and developing small-scale applications without initial costs. However, keep in mind the 3-month limit for the trial period.
- **Testing Cloud Services for small projects**: Experiment with Google Cloud services to determine their suitability for your specific small project needs within the 3-month timeframe.
- **Learning Cloud fundamentals**: Gain practical experience with core cloud functionalities on a smaller scale before transitioning to a paid plan for larger projects.
