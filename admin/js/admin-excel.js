// =============================================================================
// VINVITE ADMIN — EXCEL/CSV HELPER
// Requires the SheetJS CDN script loaded first:
// <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
// =============================================================================

// Reads a .xlsx or .csv File into an array of row objects (first row = headers).
window.parseExcelFile = function (file) {
  return new Promise((resolve, reject) => {
    if (typeof XLSX === "undefined") {
      reject(new Error("Library Excel belum dimuat."));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsArrayBuffer(file);
  });
};

// Triggers a download of `data` (array of plain objects) as an .xlsx file.
window.exportToExcel = function (data, filename, sheetName = "Sheet1") {
  if (typeof XLSX === "undefined") {
    window.vinviteToast && window.vinviteToast("Library Excel belum dimuat.");
    return;
  }
  if (!data || !data.length) {
    window.vinviteToast && window.vinviteToast("Tidak ada data untuk diekspor.");
    return;
  }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
};

// Downloads a blank template the user can fill in for guest import.
window.downloadGuestTemplate = function () {
  window.exportToExcel(
    [{ Nama: "Budi Santoso", WhatsApp: "081234567890", Grup: "Kantor", Sesi: "both" }],
    "template-tamu-vinvite.xlsx",
    "Tamu"
  );
};

// Maps loosely-cased spreadsheet columns into the `guests` table shape.
window.mapRowsToGuests = function (rows) {
  const pick = (row, keys) => {
    for (const k of keys) {
      const found = Object.keys(row).find((rk) => rk.toLowerCase().trim() === k);
      if (found && row[found] !== "") return String(row[found]).trim();
    }
    return "";
  };

  const validSessions = ["akad", "resepsi", "both"];

  return rows
    .map((row) => {
      const name = pick(row, ["nama", "name"]);
      if (!name) return null;
      return {
        name,
        phone: pick(row, ["whatsapp", "wa", "phone", "no. whatsapp", "no whatsapp"]),
        group_label: pick(row, ["grup", "group", "group_label"]),
      };
    })
    .filter(Boolean);
};
