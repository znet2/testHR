// ============================================================
// Google Apps Script — รับข้อมูลการลาทุกประเภท
// Deploy as Web App: Execute as "Me", Who has access: "Anyone"
// ============================================================

const SHEET_PERSONAL = 'ลากิจ';
const SHEET_SICK     = 'ลาป่วย';
const FOLDER_NAME    = 'ใบรับรองแพทย์';

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  // Debug: ดูชื่อ sheet ทั้งหมด
  if (!e.parameter || !e.parameter.leaveType) {
    const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets().map(s => s.getName());
    return buildResponse(JSON.stringify({ sheets }));
  }
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // รับ params จากทั้ง GET และ POST
    // form-encoded POST → e.parameter, JSON POST → e.postData.contents
    let params = {};
    if (e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents) || {};
      } catch {
        params = e.parameter || {};
      }
    } else {
      params = e.parameter || {};
    }

    // ถ้า params ยังว่าง ให้ลอง e.parameter อีกครั้ง
    if (!params.leaveType && e.parameter && e.parameter.leaveType) {
      params = e.parameter;
    }

    // guard: ถ้าไม่มีข้อมูลสำคัญให้หยุด
    if (!params.name || !params.leaveType) {
      return buildResponse(JSON.stringify({ status: 'error', message: 'missing required fields', received: JSON.stringify(params) }));
    }

    const leaveType = params.leaveType || '';
    const ss        = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = leaveType === 'ลาป่วย' ? SHEET_SICK : SHEET_PERSONAL;
    const sheet     = ss.getSheetByName(sheetName);

    if (!sheet) {
      return buildResponse(JSON.stringify({ status: 'error', message: 'Sheet not found: ' + sheetName }));
    }

    // อัปโหลดรูปไป Google Drive (ถ้ามี fileData)
    let fileUrl = params.fileUrl || '';
    if (leaveType === 'ลาป่วย' && params.fileData) {
      try {
        const folder   = getOrCreateFolder(FOLDER_NAME);
        const blob     = Utilities.newBlob(
          Utilities.base64Decode(params.fileData),
          params.fileType || 'image/jpeg',
          params.fileName || 'medical_cert.jpg'
        );
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileUrl = '=HYPERLINK("' + file.getUrl() + '","' + (params.fileName || 'medical_cert.jpg') + '")';
      } catch (uploadErr) {
        fileUrl = 'อัปโหลดไม่สำเร็จ: ' + uploadErr.message;
      }
    }

    if (leaveType === 'ลาป่วย') {
      sheet.appendRow([
        new Date(),
        params.name      || '',
        params.empId     || '',
        params.startDate || '',
        params.endDate   || '',
        params.reason    || '',
        params.hasCert   || 'ไม่มี',
        leaveType,
        '',  // placeholder สำหรับ fileUrl
      ]);
      // ใส่ HYPERLINK สูตรในคอลัมน์สุดท้าย (ถ้ามีไฟล์)
      if (fileUrl) {
        const lastRow = sheet.getLastRow();
        const fileCol = 9; // คอลัมน์ที่ 9
        sheet.getRange(lastRow, fileCol).setFormula(fileUrl);
      }
    } else {
      sheet.appendRow([
        new Date(),
        params.name      || '',
        params.empId     || '',
        params.startDate || '',
        params.endDate   || '',
        params.reason    || '',
        params.delegate  || '',
        leaveType,
      ]);
    }

    return buildResponse(JSON.stringify({ status: 'ok', fileUrl }));

  } catch (err) {
    return buildResponse(JSON.stringify({ status: 'error', message: err.message }));
  }
}

function getOrCreateFolder(name) {
  const folders = DriveApp.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(name);
}

function buildResponse(body) {
  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}
