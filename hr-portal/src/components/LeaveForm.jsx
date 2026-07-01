import { useState, useRef, useEffect } from 'react';
import { getDateOffset } from '../utils';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwEqaUJ50YiHyXU4x-3JF4GfAjMpi3D79_8fHOObx9JosGQYyIFaLMkEXeQmt5RxEllcg/exec';
const MAX_FILE_MB  = 5;           // ขนาดไฟล์สูงสุดที่รับได้ (MB) — เกินกว่านี้เปิดกล้องแทน
const IMG_MAX_PX   = 1200;        // ขนาดรูปหลังบีบ (px)
const IMG_QUALITY  = 0.75;        // quality หลังบีบ

export default function LeaveForm({ type, onClose, onToast }) {
  const [loading, setLoading] = useState(false);
  const [imgData, setImgData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [hasCert, setHasCert] = useState('no');
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(true);
  const fileInputRef = useRef();

  const isSick = type === 'sick';

  // ดึงรายชื่อพนักงานตอนโหลด
  useEffect(() => {
    fetch(APPS_SCRIPT_URL + '?action=getEmployees', { method: 'GET', mode: 'cors' })
      .then(r => r.json())
      .then(data => { if (data.employees) setEmployees(data.employees); })
      .catch(() => {})
      .finally(() => setEmpLoading(false));
  }, []);

  // บีบรูปผ่าน canvas แล้ว return base64
  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > IMG_MAX_PX) { h = Math.round(h * IMG_MAX_PX / w); w = IMG_MAX_PX; }
        if (h > IMG_MAX_PX) { w = Math.round(w * IMG_MAX_PX / h); h = IMG_MAX_PX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', IMG_QUALITY);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  async function processFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      onToast('รองรับเฉพาะไฟล์รูปภาพเท่านั้น', 'error'); return;
    }
    if (file.type === 'application/pdf') {
      onToast('PDF ไม่รองรับ กรุณาถ่ายรูปแทน', 'error'); return;
    }

    // ไฟล์เกินขนาด → แจ้งเตือนแล้วหยุด
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSizeError(true);
      onToast(`ไฟล์ใหญ่เกิน ${MAX_FILE_MB} MB — กรุณาเลือกไฟล์ที่เล็กกว่า`, 'error');
      return;
    }

    setSizeError(false);
    try {
      const dataUrl = await compressImage(file);
      setPreview(dataUrl);
      setImgData(dataUrl.split(',')[1]); // เก็บเฉพาะ base64
    } catch {
      onToast('ไม่สามารถประมวลผลรูปได้', 'error');
    }
  }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  function removeImg() {
    setImgData(null); setPreview(null); setSizeError(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd    = new FormData(e.target);
    const start = new Date(fd.get('startDate'));
    const end   = new Date(fd.get('endDate'));

    if (end < start) {
      onToast('วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น', 'error'); return;
    }
    if (!isSick) {
      const today = new Date(); today.setHours(0,0,0,0);
      if (start <= today) {
        onToast('ลากิจต้องยื่นล่วงหน้าอย่างน้อย 1 วัน', 'error'); return;
      }
    }

    const params = new URLSearchParams();
    params.append('name',      fd.get('name')      || '');
    params.append('startDate', fd.get('startDate') || '');
    params.append('endDate',   fd.get('endDate')   || '');
    params.append('reason',    fd.get('reason')    || '');
    params.append('leaveType', isSick ? 'ลาป่วย' : 'ลากิจ');

    if (isSick) {
      params.append('hasCert', hasCert === 'yes' ? 'มี' : 'ไม่มี');
      if (imgData) {
        params.append('fileData', imgData);
        params.append('fileType', 'image/jpeg');
        params.append('fileName', 'medical_cert.jpg');
      }
    }

    setLoading(true);
    try {
      // ถ้ามีรูปส่ง POST JSON (body ใหญ่), ถ้าไม่มีส่ง GET (เร็วกว่า)
      const hasFile = isSick && imgData;
      if (hasFile) {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(Object.fromEntries(params)),
        });
      } else {
        await fetch(APPS_SCRIPT_URL + '?' + params.toString(), {
          method: 'GET',
          mode: 'no-cors',
        });
      }
      onToast(isSick ? '✅ ส่งคำขอลาป่วยเรียบร้อยแล้ว' : '✅ ส่งคำขอลากิจเรียบร้อยแล้ว', 'success');
      setTimeout(onClose, 600);
    } catch (err) {
      console.error(err);
      onToast('❌ เกิดข้อผิดพลาด กรุณาลองใหม่', 'error');
    } finally {
      setLoading(false);
    }
  }

  const minStart = isSick ? undefined : getDateOffset(1);
  const maxDate  = isSick ? getDateOffset(0) : undefined;
  const accent   = isSick ? 'bg-amber-700 hover:bg-amber-600' : 'bg-[#1a3d2b] hover:bg-[#2d6a4f]';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>ชื่อ-นามสกุล <Req/></Label>
        <select name="name" required
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/15 focus:bg-white transition">
          <option value="">{empLoading ? 'กำลังโหลด...' : '-- เลือกชื่อ-นามสกุล --'}</option>
          {employees.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>{isSick ? 'วันที่เริ่มป่วย' : 'วันที่เริ่มลา'} <Req/></Label>
          <Input type="date" name="startDate" min={minStart} max={maxDate} defaultValue={isSick ? getDateOffset(0) : minStart} required />
        </div>
        <div>
          <Label>วันที่สิ้นสุด <Req/></Label>
          <Input type="date" name="endDate" min={minStart} max={maxDate} defaultValue={isSick ? getDateOffset(0) : minStart} required />
        </div>
      </div>
      <div>
        <Label>{isSick ? 'อาการ / เหตุผล' : 'เหตุผลการลา'} <Req/></Label>
        <textarea name="reason" rows={3}
          placeholder={isSick ? 'ระบุอาการหรือเหตุผล' : 'ระบุเหตุผลการลากิจ'} required
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/15 focus:bg-white resize-y transition" />
      </div>



      {isSick && (
        <>
          <div>
            <Label>มีใบรับรองแพทย์หรือไม่?</Label>
            <select name="hasCert" value={hasCert} onChange={e => { setHasCert(e.target.value); if (e.target.value === 'no') removeImg(); }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/15">
              <option value="no">ไม่มี</option>
              <option value="yes">มี</option>
            </select>
          </div>

          {hasCert === 'yes' && (
          <div>
            <Label>แนบใบรับรองแพทย์ <span className="text-gray-400 font-normal normal-case">(รูปภาพ ≤ {MAX_FILE_MB} MB)</span></Label>

            {!preview ? (
              <>
                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all
                    ${dragOver ? 'border-[#52b788] bg-emerald-50' : 'border-gray-200 hover:border-[#52b788] hover:bg-gray-50'}`}>
                  <svg className="mx-auto mb-1.5 text-gray-300" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p className="text-xs text-gray-400">คลิกหรือลากรูปมาวางที่นี่</p>
                  <p className="text-[11px] text-gray-300 mt-0.5">รูปจะถูกบีบขนาดอัตโนมัติ</p>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => processFile(e.target.files[0])} />
                </div>

                {sizeError && (
                  <p className="flex items-center gap-1.5 mt-2 text-xs text-red-500">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    ไฟล์ใหญ่เกิน {MAX_FILE_MB} MB — กรุณาเลือกไฟล์ที่เล็กกว่า
                  </p>
                )}
              </>
            ) : (
              <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <img src={preview} alt="preview" className="w-full max-h-44 object-contain p-2" />
                <button type="button" onClick={removeImg}
                  className="absolute top-2 right-2 w-6 h-6 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:border-red-300 flex items-center justify-center text-xs transition cursor-pointer shadow-sm">
                  ✕
                </button>
              </div>
            )}
          </div>
          )}
        </>
      )}

      <div className={`text-xs px-3 py-2.5 rounded-lg border-l-[3px] ${isSick ? 'bg-amber-50 border-amber-400 text-amber-800' : 'bg-emerald-50 border-[#52b788] text-emerald-800'}`}>
        {isSick ? '✅ การลาป่วยสามารถยื่นย้อนหลังได้ ภายใน 3 วันทำการ' : '⚠️ การลากิจต้องยื่นล่วงหน้าอย่างน้อย 1 วันทำการ'}
      </div>

      <button type="submit" disabled={loading}
        className={`w-full py-2.5 text-sm font-semibold text-white rounded-lg transition cursor-pointer disabled:opacity-60 ${accent}`}>
        {loading
          ? <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              กำลังส่ง...
            </span>
          : isSick ? 'ส่งคำขอลาป่วย' : 'ส่งคำขอลากิจ'
        }
      </button>
    </form>
  );
}

function Label({ children }) {
  return <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{children}</label>;
}
function Req() { return <span className="text-red-500">*</span>; }
function Input({ ...props }) {
  return <input {...props} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/15 focus:bg-white transition" />;
}
