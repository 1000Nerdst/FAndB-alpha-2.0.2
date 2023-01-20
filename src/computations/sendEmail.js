const { google } = require('googleapis');
require('dotenv').config();
require('util').promisify = require('util').promisify || require('util-promisify');

export async function sendEmail(){
    try{
        //authenticate using a service account
        const gmailAuth = new google.auth.GoogleAuth({
            keyFile: './credentials/mealplans-375318-dfc311ea8387.json',
            scopes: ['https://www.googleapis.com/auth/gmail.send']
        });
        const authClient = await gmailAuth.getClient();

        //make an instance of gmail
        const gmail = google.gmail({version: 'v1', auth: authClient});

        //create the message
        const message = [
            'From: mealsfarenbalanced@gmail.com',
            'To: solomon.west99@gmail.com',
            'Content-Type: test/html; charset=utf-8',
            'MIME-Version: 1.0',
            'Subject: Test Subject',
            '',
            '<p>Test Body<p>'
        ].join('\n');

        // Base64 encode the message
        const Base64EncodedMessage = Buffer.from(message)
            .toString('base64')
            .replace('//g','-')
            .replace('//g','_')
            .replace('/=+$/','');

        //send the message
        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: Base64EncodedMessage
            }
        });

        console.log(`Email sent with ID: ${response.data.id}`);
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}