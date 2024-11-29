# google-app-script-custom-email
Google Apps Script: Custom Email Automation

This script automates email sending from data stored in a Google Sheet, incorporating daily limits and a custom email signature.

It leverages a custom email address linked to a Gmail account to send personalized emails efficiently.
Setup Instructions

    Create a Google Spreadsheet
        Use the Gmail account linked to your custom email address.
        Name the sheet appropriately (e.g., WarmUpSheet).

    Open Google Apps Script
        In the spreadsheet, navigate to Extensions > Apps Script.
        This will open the Google Apps Script editor: https://script.google.com/.

    Add the Code
        Replace the default code.gs file with the provided script.
        Add a second script file (if needed) for managing triggers.

    Set Triggers
        Schedule a time-based trigger to execute the email-sending function periodically (e.g., every 10 minute).

Features
1. Daily Email Limit

    Cap of 48 Emails per Day:
        Keeps track of emails sent using a counter stored in script properties (emailsSentToday).
        Automatically resets the counter at the start of a new day.

    Persistent Storage:
        Uses PropertiesService to store and retrieve counters (lastSentDate and emailsSentToday) across executions.

2. Custom Email Signature

    A predefined, HTML-formatted signature is appended to each email, including:
        Sender's name, title, and contact details.
        A clickable LinkedIn profile link.

3. Dynamic Email Content

    Pulls recipient data from the Google Sheet:
        Column A: Recipient email address.
        Column B: Email subject.
        Column C: Email body.

    Updates the sheet to mark each email as "Sent" after successful delivery.

4. Error Handling

    If sending fails:
        Logs the error in the Google Apps Script console for debugging.
        Updates the sheet status to "Failed" with a timestamp.

5. Execution Constraints

    Sends one email per execution:
        Ensures compliance with Gmail API limits.
        Avoids runtime issues by processing emails incrementally.

    Stops execution once the daily quota (48 emails) is reached.

6. Reset and Cleanup Utilities

    deleteTriggers: Removes all project triggers for maintenance.
    resetCounter: Manually resets daily limits (emailsSentToday and lastSentDate).

How the Code Works: Step-by-Step
1. Initialization

    Accesses the active spreadsheet and sheet (e.g., WarmUpSheet).
    Retrieves persistent properties (emailsSentToday and lastSentDate).
    Resets daily counters if the current date differs from lastSentDate.

2. Email Sending Logic

    Identify Rows to Process:
        Reads data starting from row 2 (ignores headers).
        Skips rows with missing data or already processed ("Sent") status.

    Construct and Send Email:
        Appends the HTML signature to the body content.
        Uses GmailApp.sendEmail() to send the email.

    Update Sheet:
        Marks the email as "Sent" or "Failed" in the status column (Column D).
        Logs the timestamp of the action in Column E.

3. Error Handling

    Logs errors in the Apps Script console.
    Updates the Google Sheet with "Failed" status and the timestamp.

4. Quota Check and Exit

    After sending an email:
        Increments the daily counter (emailsSentToday).
        Exits to comply with daily limits.

Real-World Usage
Setup

    Runs as a time-based trigger (e.g., every hour).
    Gradually processes emails to avoid Gmail API and Apps Script limits.

Data Input

    The Google Sheet should include:
        Column A: Email addresses.
        Column B: Subjects.
        Column C: Message bodies.

Processing

    Each execution:
        Sends one email.
        Updates the sheet to reflect the email’s status.

Quota and Logs

    Stops processing for the day after reaching 48 emails.
    Maintains logs for easy monitoring and debugging.

Benefits of This Design

    Modular and Scalable: Can handle increasing datasets with incremental execution.
    Compliant: Adheres to Gmail's daily sending limits and Apps Script execution time constraints.
    Customizable: Easily modify the email content, signature, or daily limits.

This project provides a simple yet powerful solution for automating email workflows while maintaining professional communication standards.