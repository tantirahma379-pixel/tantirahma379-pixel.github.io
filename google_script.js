// ==========================================
// GOOGLE APPS SCRIPT UNTUK TERMOLEARN
// ==========================================

const SHEET_NAME_USERS = 'Users';
const SHEET_NAME_RESULTS = 'Results';
const ADMIN_EMAIL = 'admin@thermolearn.id';
const SPREADSHEET_ID = 'xxxxxxxx';

function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  let sheetUsers = ss.getSheetByName(SHEET_NAME_USERS);
  if (!sheetUsers) {
    sheetUsers = ss.insertSheet(SHEET_NAME_USERS);
    sheetUsers.appendRow(['Timestamp', 'Email', 'Password', 'Nama', 'Role', 'Login Terakhir']);
    sheetUsers.getRange("A1:F1").setFontWeight("bold");
    sheetUsers.setFrozenRows(1);
  }

  let sheetResults = ss.getSheetByName(SHEET_NAME_RESULTS);
  if (!sheetResults) {
    sheetResults = ss.insertSheet(SHEET_NAME_RESULTS);
    sheetResults.appendRow(['Email', 'Nama', 'S1', 'S2', 'S3', 'S4', 'Eval', 'Total', 'Summary', 'UpdatedAt']);
    sheetResults.getRange("A1:J1").setFontWeight("bold");
    sheetResults.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const email = params.email || '';

    if (action === 'get_all_results') {
      return handleGetAllResults();
    }

    if (action === 'sync_result') {
      return handleSyncResult(params);
    }

    // Untuk action login & register
    if (!email) {
      return createJsonResponse({ status: 'error', message: 'Email diperlukan' });
    }

    const password = params.password || '';
    const name = params.name || email.split('@')[0];

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME_USERS);
    if (!sheet) {
      setup();
      sheet = ss.getSheetByName(SHEET_NAME_USERS);
    }

    const data = sheet.getDataRange().getValues();
    let userRowIndex = -1;
    let userData = null;

    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === email) {
        userRowIndex = i + 1;
        userData = {
          email: data[i][1],
          password: data[i][2],
          name: data[i][3],
          role: data[i][4]
        };
        break;
      }
    }

    const timestamp = new Date();

    if (action === 'login') {
      if (userRowIndex !== -1) {
        if (userData.password !== password) {
          return createJsonResponse({ status: 'error', message: 'Password salah!' });
        }
        sheet.getRange(userRowIndex, 6).setValue(timestamp);

        // Ambil progress dari tabel Results
        const progress = getUserProgress(email);

        return createJsonResponse({
          status: 'success',
          message: 'Login berhasil',
          data: userData,
          progress: progress
        });
      } else {
        return createJsonResponse({ status: 'error', message: 'Email belum terdaftar. Silakan daftar terlebih dahulu.' });
      }

    } else if (action === 'register') {
      if (userRowIndex !== -1) {
        return createJsonResponse({ status: 'error', message: 'Email sudah terdaftar. Silakan login.' });
      } else {
        if (!password) {
          return createJsonResponse({ status: 'error', message: 'Password tidak boleh kosong untuk pendaftaran baru.' });
        }
        const role = (email === ADMIN_EMAIL) ? 'admin' : 'siswa';
        sheet.appendRow([timestamp, email, password, name, role, timestamp]);
        userData = { email: email, name: name, role: role };

        return createJsonResponse({
          status: 'success',
          message: 'Pendaftaran berhasil',
          data: userData,
          progress: null
        });
      }
    } else {
      return createJsonResponse({ status: 'error', message: 'Action tidak valid' });
    }

  } catch (error) {
    return createJsonResponse({ status: 'error', message: 'Terjadi kesalahan: ' + error.toString() });
  }
}

function handleSyncResult(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetResults = ss.getSheetByName(SHEET_NAME_RESULTS);
  if (!sheetResults) {
    setup();
    sheetResults = ss.getSheetByName(SHEET_NAME_RESULTS);
  }

  const email = params.email;
  const name = params.name;
  if (!email) return createJsonResponse({ status: 'error', message: 'Email tidak valid untuk sinkronisasi' });

  const data = sheetResults.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) { // Kolom Email indeks 0
      rowIndex = i + 1;
      break;
    }
  }

  // Data array
  // 0: Email, 1: Nama, 2: S1, 3: S2, 4: S3, 5: S4, 6: Eval, 7: Total, 8: Summary, 9: UpdatedAt
  const rowData = [
    email,
    name || '',
    params.s1 !== undefined && params.s1 !== null ? params.s1 : '',
    params.s2 !== undefined && params.s2 !== null ? params.s2 : '',
    params.s3 !== undefined && params.s3 !== null ? params.s3 : '',
    params.s4 !== undefined && params.s4 !== null ? params.s4 : '',
    params.eval !== undefined && params.eval !== null ? params.eval : '',
    params.total !== undefined && params.total !== null ? params.total : '',
    params.summary || '',
    params.updatedAt || new Date().toISOString()
  ];

  if (rowIndex !== -1) {
    // Update baris
    sheetResults.getRange(rowIndex, 1, 1, 10).setValues([rowData]);
  } else {
    // Insert baru
    sheetResults.appendRow(rowData);
  }

  return createJsonResponse({ status: 'success', message: 'Sync berhasil' });
}

function handleGetAllResults() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetResults = ss.getSheetByName(SHEET_NAME_RESULTS);
  if (!sheetResults) return createJsonResponse({ status: 'success', data: [] });

  const data = sheetResults.getDataRange().getValues();
  const resultData = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    resultData.push({
      email: row[0],
      name: row[1],
      s1: row[2] === '' ? null : Number(row[2]),
      s2: row[3] === '' ? null : Number(row[3]),
      s3: row[4] === '' ? null : Number(row[4]),
      s4: row[5] === '' ? null : Number(row[5]),
      eval: row[6] === '' ? null : Number(row[6]),
      total: row[7] === '' ? null : Number(row[7]),
      summary: row[8],
      updatedAt: row[9]
    });
  }
  return createJsonResponse({ status: 'success', data: resultData });
}

function getUserProgress(email) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetResults = ss.getSheetByName(SHEET_NAME_RESULTS);
  if (!sheetResults) return null;

  const data = sheetResults.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      const row = data[i];
      return {
        email: row[0],
        name: row[1],
        s1: row[2] === '' ? null : Number(row[2]),
        s2: row[3] === '' ? null : Number(row[3]),
        s3: row[4] === '' ? null : Number(row[4]),
        s4: row[5] === '' ? null : Number(row[5]),
        eval: row[6] === '' ? null : Number(row[6]),
        total: row[7] === '' ? null : Number(row[7]),
        summary: row[8],
        updatedAt: row[9]
      };
    }
  }
  return null;
}

function doOptions(e) {
  return createJsonResponse({ status: 'success' });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('ThermoLearn')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
