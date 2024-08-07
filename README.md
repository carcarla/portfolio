# Carla's Portfolio

Carla is a experienced full-stack web developer with over 10 years of professional experience. Throughout her career, she has worked on a wide range of web-related projects.

Some of Carla's notable project experiences include:
- Developing a fund product application for different region (HK: https://www.manulifeim.com.hk/ MY: https://client.asia.manulifeam.com/en_MY) using a modern tech stack including ReactJS, Typescript, Node.js, and MongoDB
- Implementing the corporate website for Cathay Pacific (https://www.cathaypacific.com/) using AEM as the content management system, along with Node.js and jQuery
- Building the website for Lee Gardens (https://www.leegardens.com.hk/), using the Kentico CMS, Bootstrap, and jQuery

In addition to these larger-scale projects, Carla has also demonstrated her versatility by completing a variety of smaller web development tasks over the years. In 2019, she created a simple web application using HTML, CSS, Node.js, MongoDB, firebase and AWS, the details of which a provided below.


# Top 5 Websites Report

It's a web application for showing top 5 websites report. All data come from database and import by CSV. It is using MongoDB to store website visits data. Also, Firebase Auth provides email and password authentication features. User must authenticate to use the application. It allows user to upload CSV as standard format to host system or AWS S3. Once the uploaded file will trigger importing data process.

The report is based on the selected date or date range to show top 5 websites and include their respective total visits. Also, it can be applied an exclusion list from API for a selected date must be excluded from the results.



## Product

When you linked to landing page and it will request to sign in. You can sign in](http://localhost/login) or [sign up](http://localhost/register) your own account for accessing the web application.

![Login cap screen](https://user-images.githubusercontent.com/48790647/54965206-81aacd80-4faa-11e9-9842-9b6c5d27e31b.png)

After [login](http://localhost/login) the report will show directly as latest date records in database. When you change the date and the report automatically updates accordingly.

![Report cap screen](https://user-images.githubusercontent.com/48790647/54944482-8ce00800-4f6e-11e9-8f74-eea2a7b7f17d.png)

For import function, you can upload correct format of CSV to AWS S3 storage [arn:aws:s3:::top5websites](arn:aws:s3:::top5websites) under folder `/importCSV`. Once a CSV file is added, the content will load into the database.

### Requirements

* Node 18 - JavaScript run-time environment
* Express 4 - Node.js web application framework
* MongoDB Atlas - Database
* Firebase Auth - Authentication Service

For AWS cloud hosting, it's also requirements
* AWS Elastic Beanstalk - Web Application Server
* Amazon S3 - Cloud Storage
* AWS Lambda - Serverless Computing Platform



## Getting Started

Prepare software and service account

> [MongoDB](https://www.mongodb.com)

You can following MongoDB instruction to install and configure MongoDB server on your local machine or you can use MongoDB Atlas (MongoDB Cloud Service)
- Download MongoDB: [https://www.mongodb.com/download-center/community](https://www.mongodb.com/download-center/community)
- Install MongoDB: [https://docs.mongodb.com/manual/installation/](https://docs.mongodb.com/manual/installation/)
- MongoDB Atlas: [https://www.mongodb.com/cloud](https://www.mongodb.com/cloud)

> [Express](https://expressjs.com/)

Express is an incredible Node.js web application framework. It organizes your web app into an MVC architecture on the server side. To install Express, run the following code in Terminal:

```bash
npm install express
```

> [Firebase Auth](https://firebase.google.com/products/auth/)

Firebase Auth is a service that can authenticate users using only client-side code. it includes a user management system whereby developers can enable user authentication with email and password login stored with Firebase.
- Create/Sign in to Firebase account.
- Go to the [Firebase Console](https://console.firebase.google.com) and add or navigate to your project:
  - Select the **Auth** panel and then click the **Sign In Method** tab.
  - Click **Email/Password** and turn on the **Enable** switch, then click **Save**.
  - Under **Authorized Domains** click **Add Domain** and add `auth.example.com`.
- Run the app on your device or emulator.
    - Select **EmailPasswordActivity** from the main screen.
    - Fill in your desired email and password and click **Create Account** to begin.

> [Source Code](https://github.com/carcarla/top5websites.git)

Clone this repo to your local machine using

```bash
git clone https://github.com/carcarla/top5websites.git
cd top5websites
```

### Installing

In Terminal, open your project directory and run the following code:
```bash
npm install
```

> MongoDB configuration

Change `./top5websites/config/default.json` MongoDB connection string (connectionString) and database name (dbName)
```JS
{
  "connectionString": "mongodb://localhost/dbtopwebsites",
  "dbName":"dbtop5websites"
  ...
}
```

> Firebase admin SDK

Same name replace your Firebase admin SDK configuration JSON to `./top5websites/config/firebase.json`.
You can download it form https://console.firebase.google.com/project/[Project_ID]/settings/serviceaccounts/adminsdk
```JS
{
  "type": "service_account",
  "project_id": [Project ID],
  "private_key_id": [Private key ID],
  "private_key": [Private key],
  "client_email": [Client email],
  "client_id": [Client ID],
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": [Client Cert URL]
}
```

> Firebase front-end configuration

Change `./top5websites/public/js/firebase-config.json` apiKey, authDomain and projectId.
You can find those information in Firebase console https://console.firebase.google.com/project/[Project_ID]/settings/general/
```JS
var config = {
	apiKey: [API Key],
	authDomain: [Auth Domain],
	projectId: [Project ID]
}
...
```

> Import CSV & Exclusion List API URL

Change in `./top5websites/config/default.json`
```JS
{
...
"csvfolder" : "../../public/files/",
"exclusionList": "http://private-1de182-mamtrialrankingadjustments4.apiary-mock.com/exclusions"
...
}
```

> Start your web app on your server

Make sure your MongoDB already up and running before you continue.
```bash
npm start
```

Go to [http://localhost:8081](http://localhost:8081)



## Running the test

Automated test script put under `./test`, run the following code in Terminal to start the automated test:
```bash
npm test
```


## Deployment

For AWS cloud hosting, AWS Elastic Beanstalk for web application, Amazon S3 for CSV import storage and AWS Lambda for automatically trigger CSV import when CSV file upload to S3.

> EB CLI

Setup EB CLI on your machine for deploy to AWS Elastic Beanstalk.
Please reference [Install the Elastic Beanstalk Command Line Interface (EB CLI)](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html)

Configuration your EB CLI in Terminal:
```bash
eb init
```

Configuration detail please reference:
[Configure the EB CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-configuration.html)

> AWS Lambda

Go to AWS Lambda and `Create function` as `Author from scratch`.
```
Function name: [Function name]
Runtime: Node.js 20

````

Copy and paste from `./top5websites/lambda/index.js` to `Function Code` index.js:
```
const http = require('http')
const host = [Elastic Beanstalk Host]
const api = '/api/importcsv/'

exports.handler = async (event) => {
	return new Promise((resolve, reject) => {
		var key = event.Records[0].s3.object.key
		key = key.replace(/\+/g,' ')
		key = decodeURIComponent(key);
		const options = {
			host: host,
			path: api + encodeURIComponent(key),
			method: 'GET'
		};

		const req = http.request(options, (res) => {
			resolve('Success');
		});

		req.on('error', (e) => {
			reject(e.message);
		});

		// send the request
		req.write('');
		req.end();
	});
};
```

> Amazon S3 Bucket

Create Amazon S3 Bucket for CSV upload and add events in bucket properties.
```
Prefix: [Upload Folder Path]
Suffix: .csv
Send to: Lambda Function
Lambda: [Lambda Function Name]
```

Add your S3 access information in `./top5websites/config/default.json`
```JS
// S3 config
"useS3": true,
"S3": {
"access": {
  	"accessKeyId": [Access Key ID],
  	"secretAccessKey": [Secret Access Key],
  	"region": [Region]
  },
	"bucket": [Bucket],
	"folder": [Upload Folder Path]
},
```

Run the following code in Terminal to start deployment:
```bash
npm run deploy
```


## Function can be added

- Report
  - Graphic display for report (e.g. bar chart, Trend chart)
  - Report export feature (excel/PDF/email)
  - Blackout date on report date range date picker
- Date import
  - Logging, monitoring for data import
  - Better access control for data import
  - House keeping for upload file
- Authentication
  - User control for access report



## Built With

* [Node](https://nodejs.org/) - JavaScript run-time environment used
* [Express](https://expressjs.com/) - The web framework used
* [MongoDB](https://www.mongodb.com/) - Database used
* [Firebase](https://firebase.google.com/) - Authentication Service used



## Author

* **Carla Fok**
