# Quizable Backend 

## How to run locally 

Install dotnet.

Navigate to the root of this project. (`./backend/QuizApp`)

Run this command: 

```shell
dotnet watch
```

## How to deploy to Google Cloud

For this we will use Google Cloud Run. 

Install the necessary command line tools using this [link](https://cloud.google.com/sdk/docs/install)

Once you have it installed, open the terminal and navigate to the root of this project.

### `gcloud` init

Make sure `gcloud` is available in the terminal by running this command: 

```shell
gcloud --version
```

### Login to google cloud 

Run this command to login to google cloud: 

```shell
gcloud auth login
```

### Create a new google cloud project from command line

Run this command and follow the instructions the google CLI gives you to create a new project.

```
gcloud init
```

### Set the project by setting the project id

If you have a project in the Google Cloud Dashboard, find the Project ID and copy it. 

Type this command and paste your it as such: 

```shell 
gcloud config set project <your_project_id_here>
```

### Create a repository for the build programm to go to

run this command to create a repository.

```shell
gcloud artifacts repositories create quizapp-repo --repository-format=docker --location=europe-central2 --description="Docker repository"
```

### Build and submit the program to gcloud

Note the region must be us-west2

```shell 
gcloud builds submit --region=us-west2 --config ./deploy/cloudbuild.yaml
```

### Start the program in the cloud.

```shell
gcloud run deploy quizapp --region=europe-west2 --image europe-central2-docker.pkg.dev/quizzabletest/hello-repo/quizapp-image:quizapp
```

w

## Full list of commands

```shell 
gcloud auth login
gcloud config set project <your_project_id_here>
gcloud artifacts repositories create quizapp-repo --repository-format=docker --location=europe-central2 --description="Docker repository"
gcloud builds submit --region=us-west2 --config ./deploy/cloudbuild.yaml
gcloud run deploy quizapp --region=europe-west2 --image europe-central2-docker.pkg.dev/quizzabletest/hello-repo/quizapp-image:quizapp
```

Enjoy!


<!-- Add how to deploy on dedicated server with docker infrastructure -->
