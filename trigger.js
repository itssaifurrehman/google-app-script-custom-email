function createTimeDrivenTrigger() {
    ScriptApp.newTrigger('sendEmailsWithCustomSignature')
      .timeBased()
      .everyMinutes(10) 
      .create();
  }