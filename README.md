# Open Asset Export

The purpose of this script is for downloading all files in Open Asset account sorted by project to local folders "./images".

To start using this script, you will need access to Open Asset API and get TOKEN_ID and TOKEN_STRING from Open Asset account.

1. Clone the repo

```javascript
git clone https://github.com/goatshub/openasset-export.git .
npm i
```

2. Create .env file with TOKEN_ID and TOKEN_STRING. Look at .env.example file for guide.

3. Run script

```javascript
npm run start
```

5. Done.

It can take a long time so it's ok to cancel mid run by ctrl + c. Be careful of the available space in your drive and remove unfinshed downloaded file from the last run.

You can start later by continuing at the latest project index downloaded by editing parameter in function in index.js file.

Example:

1. Latest folder downloaded is "./images/31 - xxxxxx xxxx xxx" (project ID is 31 but the index is 30)

2. Edit line 39 in index.js to getOAProjectFilesToFolder(**30**).

3. Rerun the script again. The script will start getting data from project 31 onwards
