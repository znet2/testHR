// ============================================================
// Google Apps Script — รับข้อมูลการลาทุกประเภท
// Deploy as Web App: Execute as "Me", Who has access: "Anyone"
// ============================================================

const SHEET_PERSONAL = 'ลากิจ';
const SHEET_SICK     = 'ลาป่วย';
const SHEET_EMP      = 'ชื่อพนักงาน';
const SHEET_HR       = 'HR';
const FOLDER_NAME    = 'ใบรับรองแพทย์';

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  // ดึงรายการคำขอลาทั้งหมด (สำหรับ HR)
  if (e.parameter && e.parameter.action === 'getLeaveRequests') {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const results = [];

    // ลากิจ: col A=timestamp,B=name,C=start,D=end,E=reason,F=type,G=status
    const sheetP = ss.getSheetByName(SHEET_PERSONAL);
    if (sheetP && sheetP.getLastRow() > 1) {
      const rows = sheetP.getRange(2, 1, sheetP.getLastRow() - 1, 7).getValues();
      rows.forEach((r, i) => {
        if (r[1]) results.push({ row: i + 2, sheet: SHEET_PERSONAL, timestamp: r[0], name: r[1], startDate: r[2], endDate: r[3], reason: r[4], leaveType: r[5], status: r[6] || 'รอดำเนินการ' });
      });
    }

    // ลาป่วย: col A=timestamp,B=name,C=start,D=end,E=reason,F=hasCert,G=type,H=file,I=status
    const sheetS = ss.getSheetByName(SHEET_SICK);
    if (sheetS && sheetS.getLastRow() > 1) {
      const rows = sheetS.getRange(2, 1, sheetS.getLastRow() - 1, 9).getValues();
      rows.forEach((r, i) => {
        if (r[1]) results.push({ row: i + 2, sheet: SHEET_SICK, timestamp: r[0], name: r[1], startDate: r[2], endDate: r[3], reason: r[4], hasCert: r[5], leaveType: r[6], status: r[8] || 'รอดำเนินการ' });
      });
    }

    // เรียงตาม timestamp ใหม่ก่อน
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return buildResponse(JSON.stringify({ status: 'ok', requests: results }));
  }

  // อัปเดตสถานะ (สำหรับ HR)
  if (e.parameter && e.parameter.action === 'updateLeaveStatus') {
    const sheetName = e.parameter.sheet;
    const row       = parseInt(e.parameter.row);
    const newStatus = e.parameter.status; // อนุมัติ / ไม่อนุมัติ
    const ss        = SpreadsheetApp.getActiveSpreadsheet();
    const sheet     = ss.getSheetByName(sheetName);
    if (!sheet) return buildResponse(JSON.stringify({ status: 'error', message: 'Sheet not found' }));
    // ลากิจ status อยู่คอลัมน์ 7, ลาป่วย status อยู่คอลัมน์ 9
    const statusCol = sheetName === SHEET_SICK ? 9 : 7;
    sheet.getRange(row, statusCol).setValue(newStatus);
    return buildResponse(JSON.stringify({ status: 'ok' }));
  }

  // ดึงสถานะของพนักงานคนนั้น
  if (e.parameter && e.parameter.action === 'getMyLeaveStatus') {
    const name = (e.parameter.name || '').trim();
    const ss   = SpreadsheetApp.getActiveSpreadsheet();
    const results = [];

    const sheetP = ss.getSheetByName(SHEET_PERSONAL);
    if (sheetP && sheetP.getLastRow() > 1) {
      const rows = sheetP.getRange(2, 1, sheetP.getLastRow() - 1, 7).getValues();
      rows.forEach((r, i) => {
        if (r[1] === name) results.push({ timestamp: r[0], name: r[1], startDate: r[2], endDate: r[3], reason: r[4], leaveType: r[5], status: r[6] || 'รอดำเนินการ' });
      });
    }

    const sheetS = ss.getSheetByName(SHEET_SICK);
    if (sheetS && sheetS.getLastRow() > 1) {
      const rows = sheetS.getRange(2, 1, sheetS.getLastRow() - 1, 9).getValues();
      rows.forEach((r, i) => {
        if (r[1] === name) results.push({ timestamp: r[0], name: r[1], startDate: r[2], endDate: r[3], reason: r[4], leaveType: r[6], status: r[8] || 'รอดำเนินการ' });
      });
    }

    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return buildResponse(JSON.stringify({ status: 'ok', requests: results }));
  }

  // ดึง role ของ user
  if (e.parameter && e.parameter.action === 'getRole') {
    const email = (e.parameter.email || '').toLowerCase().trim();
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_HR);
    if (sheet) {
      const emails = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1)
        .getValues().map(r => (r[0] || '').toLowerCase().trim());
      const role = emails.includes(email) ? 'hr' : 'employee';
      return buildResponse(JSON.stringify({ status: 'ok', role }));
    }
    return buildResponse(JSON.stringify({ status: 'ok', role: 'employee' }));
  }

  // เพิ่มพนักงานใหม่
  if (e.parameter && e.parameter.action === 'addEmployee') {
    const name = (e.parameter.name || '').trim();
    if (!name) return buildResponse(JSON.stringify({ status: 'error', message: 'name is required' }));
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_EMP);
    if (!sheet) return buildResponse(JSON.stringify({ status: 'error', message: 'Sheet not found' }));
    // เช็คไม่ให้ซ้ำ
    const rows  = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
    const names = rows.map(r => r[0]).filter(n => n !== '');
    if (names.includes(name)) return buildResponse(JSON.stringify({ status: 'error', message: 'duplicate' }));
    sheet.appendRow([name]);
    return buildResponse(JSON.stringify({ status: 'ok' }));
  }

  // ลบพนักงาน
  if (e.parameter && e.parameter.action === 'removeEmployee') {
    const name = (e.parameter.name || '').trim();
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_EMP);
    if (!sheet) return buildResponse(JSON.stringify({ status: 'error', message: 'Sheet not found' }));
    const data  = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][0] === name) { sheet.deleteRow(i + 1); break; }
    }
    return buildResponse(JSON.stringify({ status: 'ok' }));
  }

  // ดึงรายชื่อพนักงาน
  if (e.parameter && e.parameter.action === 'getEmployees') {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_EMP);
    if (!sheet) return buildResponse(JSON.stringify({ status: 'error', message: 'Sheet not found' }));
    const rows  = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
    const names = rows.map(r => r[0]).filter(n => n !== '');
    return buildResponse(JSON.stringify({ status: 'ok', employees: names }));
  }

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
        params.startDate || '',
        params.endDate   || '',
        params.reason    || '',
        params.hasCert   || 'ไม่มี',
        leaveType,
        '',  // placeholder สำหรับ fileUrl
        'รอดำเนินการ', // สถานะ
      ]);
      // ใส่ HYPERLINK สูตรในคอลัมน์สุดท้าย (ถ้ามีไฟล์)
      if (fileUrl) {
        const lastRow = sheet.getLastRow();
        const fileCol = 8; // คอลัมน์ที่ 8
        sheet.getRange(lastRow, fileCol).setFormula(fileUrl);
      }
    } else {
      sheet.appendRow([
        new Date(),
        params.name      || '',
        params.startDate || '',
        params.endDate   || '',
        params.reason    || '',
        leaveType,
        'รอดำเนินการ', // สถานะ
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
