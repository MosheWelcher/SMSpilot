// --- CONFIGURATION ---
// 1. The User ID of the Copilot bot you want to tag
var COPILOT_USER_ID = "128934125"; 
// ---------------------

function doPost(e) {
  try {
    var json = JSON.parse(e.postData.contents);
    
    // Extract necessary data
    var text = json.text;
    var senderType = json.sender_type; 
    var senderId = json.user_id; // ID of who sent the message
    var groupId = json.group_id; 

    // --- FILTERING LOGIC ---
    
    // 1. Ignore empty messages
    if (!text) return ContentService.createTextOutput("Ignored: Empty");

    // 2. Ignore Bots (Standard check)
    if (senderType === 'bot') return ContentService.createTextOutput("Ignored: Bot");

    // 3. Ignore Copilot specifically (Double safety if it acts like a user)
    if (senderId === COPILOT_USER_ID) return ContentService.createTextOutput("Ignored: Copilot ID");

    // 4. CRITICAL: Ignore messages that already start with "@Copilot"
    if (text.trim().indexOf("@Copilot") === 0) {
      return ContentService.createTextOutput("Ignored: Loop Prevention");
    }

    // --- TOKEN RETRIEVAL ---
    // Retrieve the specific token for this group from Script Properties
    var token = PropertiesService.getScriptProperties().getProperty(groupId);

    if (!token) {
      Logger.log("Error: No access token found for Group ID " + groupId);
      // If we don't have a token, we can't post as a user.
      return ContentService.createTextOutput("Error: Token Missing");
    }

    // -----------------------

    // Send the message using the retrieved token
    sendAsUser(text, groupId, token);

    return ContentService.createTextOutput("OK");

  } catch (error) {
    Logger.log("Error in doPost: " + error);
    return ContentService.createTextOutput("Error");
  }
}

function sendAsUser(originalMessage, groupId, token) {
  // Use the dynamic token passed from doPost
  var url = 'https://api.groupme.com/v3/groups/' + groupId + '/messages?token=' + token;
  
  var mentionName = "@Copilot"; 
  var finalText = mentionName + " " + originalMessage;

  // Generate a unique GUID for the message (Required for User API)
  var messageGuid = Utilities.getUuid();

  var payload = {
    "message": {
      "source_guid": messageGuid,
      "text": finalText,
      "attachments": [
        {
          "type": "mentions",
          "user_ids": [COPILOT_USER_ID],
          "loci": [[0, mentionName.length]] // Tag the "@Copilot" part
        }
      ]
    }
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log("Sent as User: " + finalText + " | Response: " + response.getContentText());
  } catch (e) {
    Logger.log("Failed to send as User: " + e);
  }
}
