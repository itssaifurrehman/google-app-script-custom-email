function sendEmailsWithCustomSignature() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('sheetName');
  var startRow = 2; //skip the header
  var properties = PropertiesService.getScriptProperties();

  Logger.log("Trigger started at: " + new Date());

  // Get current date as a string
  var currentDate = new Date().toDateString();
  var lastSentDate = properties.getProperty('lastSentDate');
  var emailsSentToday = parseInt(properties.getProperty('emailsSentToday')) || 0;
  var maxEmailsPerDay = 48;

  // Reset counter if it's a new day
  if (!lastSentDate || lastSentDate !== currentDate) {
    Logger.log(`New day detected. Resetting counters. Previous date: ${lastSentDate}`);
    properties.setProperty('lastSentDate', currentDate);
    emailsSentToday = 0;
    properties.setProperty('emailsSentToday', emailsSentToday);
  }

  if (emailsSentToday >= maxEmailsPerDay) {
    Logger.log(`Quota limit reached (${emailsSentToday}/${maxEmailsPerDay}). Stopping email sending.`);
    return;
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < startRow) {
    Logger.log("No data to process in the sheet.");
    return;
  }

  var signature =
    '<br><br>' +
    '<strong>Saif Ur.</strong><br>' +
    'Founder @inceptasquare<br>' +
    'Email: <a href="mailto:saif@inceptasquare.com">saif@inceptasquare.com</a><br>' +
    'Call: <a href="tel:+15199999386">+15199999386</a><br>' +
    'LinkedIn: <a href="https://www.linkedin.com/in/saifurrehman96/" target="_blank">https://www.linkedin.com/in/saifurrehman96/</a>';

  var fromAddress = "saif@inceptasqaure.biz";

  // Process only one email
  for (var rowIndex = startRow; rowIndex <= lastRow; rowIndex++) {
    var row = sheet.getRange(rowIndex, 1, 1, 5).getValues()[0]; // Include Timestamp column
    var emailAddress = row[0]; // Column A: Recipient's email address
    var subject = row[1]; // Column B: Subject
    var message = row[2]; // Column C: Message
    var status = row[3]; // Column D: Status

    if (status === "Sent") {
      Logger.log(`Skipping email at row ${rowIndex}: Already sent to ${emailAddress}`);
      continue; // Skip already sent emails
    }

    if (!emailAddress || !subject || !message) {
      Logger.log(`Row ${rowIndex} skipped: Missing email, subject, or message.`);
      continue;
    }

    var fullMessage = message + signature;

    try {
      // Send email
      GmailApp.sendEmail(emailAddress, subject, "", {
        htmlBody: fullMessage,
        from: fromAddress,
      });

      Logger.log(`Email sent to: ${emailAddress} | Row: ${rowIndex}`);
      sheet.getRange(rowIndex, 4).setValue("Sent"); // Update Status column
      sheet.getRange(rowIndex, 5).setValue(new Date()); // Update Timestamp column

      emailsSentToday++;
      properties.setProperty('emailsSentToday', emailsSentToday);
      
      // Exit after sending one email
      return;

    } catch (error) {
      Logger.log(`Error sending email to: ${emailAddress} | Error: ${error.message}`);
      sheet.getRange(rowIndex, 4).setValue("Failed"); // Mark Status as Failed
      sheet.getRange(rowIndex, 5).setValue(new Date()); // Log Timestamp for the error
    }
  }

  Logger.log("No emails left to send in this trigger execution.");
  deleteTriggers();
}

// Function to delete all triggers
function deleteTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  Logger.log("All triggers deleted.");
}

// Function to manually reset daily limits
function resetCounter() {
  var properties = PropertiesService.getScriptProperties();
  properties.setProperty('emailsSentToday', 0);
  properties.setProperty('lastSentDate', new Date().toDateString());
  Logger.log("Daily counter reset manually.");
}
