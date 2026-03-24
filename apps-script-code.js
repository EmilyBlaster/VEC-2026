/**
 * VEC Review System — Google Apps Script Backend
 *
 * This script handles reading and writing review comments
 * for the VEC 2026 event site prototype.
 *
 * Deploy as: Web App > Execute as Me > Anyone can access
 *
 * Uses GET for both read and write to avoid Workspace CORS/redirect issues.
 * - GET with no "action" param → returns all comments as JSON
 * - GET with action=write → writes a new comment row
 */

function doGet(e) {
  var params = e.parameter;

  // If action=write, add a new comment
  if (params.action === 'write') {
    return writeComment(params);
  }

  // Otherwise, return all comments
  return readComments();
}

function readComments() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  var data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = data[0];
  var rows = [];

  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    rows.push(obj);
  }

  return ContentService
    .createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}

function writeComment(params) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');

  sheet.appendRow([
    params.timestamp || new Date().toISOString(),
    params.id || '',
    params.author || 'Anonymous',
    params.text || '',
    params.pageX || 0,
    params.pageY || 0,
    params.sectionId || 'unknown',
    params.xPercent || 0,
    params.yOffsetInSection || 0,
    params.viewportWidth || 0,
    params.resolved || false
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', id: params.id }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Keep doPost as fallback
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.id || '',
    data.author || 'Anonymous',
    data.text || '',
    data.pageX || 0,
    data.pageY || 0,
    data.sectionId || 'unknown',
    data.xPercent || 0,
    data.yOffsetInSection || 0,
    data.viewportWidth || 0,
    data.resolved || false
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', id: data.id }))
    .setMimeType(ContentService.MimeType.JSON);
}
