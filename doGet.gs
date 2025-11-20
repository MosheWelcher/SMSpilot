function doGet(e) {
  var token = e.parameter.access_token;

  // 1. Server-side check for the token
  if (!token) {
    return ContentService.createTextOutput("Error: No access_token found. Please authorize via GroupMe first.");
  }

  // 2. Create the template from the 'index.html' file
  var template = HtmlService.createTemplateFromFile('index');
  
  // 3. Pass the token variable into the HTML file
  template.token = token; 
  
  // 4. Serve the page
  return template.evaluate()
      .setTitle("Setup Status")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// --- SERVER SIDE FUNCTIONS (Called by index.html via google.script.run) ---

function createGroup(token) {
  // User Override: Using GET for Group Creation
  var url = "https://api.groupme.com/v3/groups?token=" + token;
  var payload = { "name": "SMSpilot", "share": false };
  
  var response = UrlFetchApp.fetch(url, {
    method: "GET", 
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
  
  var data = JSON.parse(response.getContentText());
  return data.response.id;
}

function createBot(token, groupId) {
  // DOCUMENTATION NOTE:
  // https://dev.groupme.com/docs/v3#bots_create
  var scriptUrl = ScriptApp.getService().getUrl();
  var url = "https://api.groupme.com/v3/bots?token=" + token;
  
  var payload = {
    "bot": {
      "name": "Bridge Bot",
      "group_id": groupId,
      "callback_url": scriptUrl
    }
  };
  
  UrlFetchApp.fetch(url, {
    method: "POST", 
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}

function saveToken(groupId, token) {
  PropertiesService.getScriptProperties().setProperty(groupId, token);
}
