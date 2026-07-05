export const SHEET_CONFIG = {
  sheetId: '12k_isMFiwZ-8QwG5RfLrAwDQ77vCbCDIgkCJ41E8ZNo',
  sheets: [
    {
      // ลากิจ: A=timestamp, B=ชื่อ, C=วันเริ่ม, D=วันสิ้นสุด, E=เหตุผล, F=ประเภท
      sheetName: 'ลากิจ',
      gid: '2100755242',
      cols: { name: 1, empId: -1, startDate: 2, endDate: 3, reason: 4, leaveType: 5, fileUrl: -1 },
    },
    {
      // ลาป่วย: A=timestamp, B=ชื่อ, C=วันเริ่ม, D=วันสิ้นสุด, E=เหตุผล, F=ใบรับรอง, G=ประเภท, H=รูป
      sheetName: 'ลาป่วย',
      gid: '481045318',
      cols: { name: 1, empId: -1, startDate: 2, endDate: 3, reason: 4, leaveType: 6, fileUrl: 7 },
    },
  ],
};

export const GOOGLE_FORM_URLS = {
  personal: {
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeoMKY85QIcK9vR2i9CjDk19ULsy9I7Sc8zxGoZAKaz1jPmZw/formResponse',
    fields: {
      name: 'entry.1538004273', empId: 'entry.987277078',
      startDate: 'entry.1044869709', endDate: 'entry.486364817',
      reason: 'entry.1558773897', delegate: 'entry.1628842610',
      leaveType: 'entry.1145961194',
    },
  },
  sick: {
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe6P6OUPtUprdf7Z3dTwsjZnGpXF2qFBRxN8KHha0HyhRbvOg/formResponse',
    fields: {
      name: 'entry.521751186', empId: 'entry.1106591303',
      startDate: 'entry.2040197658', endDate: 'entry.374835473',
      reason: 'entry.1746793246', hasCert: 'entry.1344089317',
      leaveType: 'entry.1618285584',
    },
  },
};

export const MONTHS_TH = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
];
export const DAYS_TH = ['อา','จ','อ','พ','พฤ','ศ','ส'];
