// =============================================================================
// VINVITE ADMIN — BANK & E-WALLET DATA
// =============================================================================

window.VINVITE_BANKS = [
  "BCA", "Mandiri", "BNI", "BRI", "BSI (Bank Syariah Indonesia)",
  "CIMB Niaga", "Danamon", "Permata", "BTN", "Maybank",
  "Panin Bank", "OCBC NISP", "BNC (Neo Commerce)", "Jenius (BTPN)",
  "Lainnya"
];

window.VINVITE_EWALLETS = [
  "GoPay", "OVO", "DANA", "ShopeePay", "LinkAja",
  "iSaku", "Sakuku (BCA)", "Lainnya"
];

// Renders a complete Amplop Digital repeater item with dropdowns.
window.giftItemHtml = function (a = {}) {
  const isBank = !a.type || a.type === "Bank Transfer";
  const nameOptions = isBank ? window.VINVITE_BANKS : window.VINVITE_EWALLETS;

  return `
    <div class="repeater-item" data-repeater="gift">
      <button type="button" class="repeater-remove">✕ Hapus</button>
      <div class="field">
        <label>Jenis</label>
        <select class="a-type">
          <option value="Bank Transfer" ${isBank ? "selected" : ""}>Bank Transfer</option>
          <option value="E-Wallet" ${!isBank ? "selected" : ""}>E-Wallet</option>
        </select>
      </div>
      <div class="field">
        <label>Nama Bank / E-Wallet</label>
        <select class="a-bank">
          ${nameOptions.map(n => `<option value="${n}" ${n === a.bank_name ? "selected" : ""}>${n}</option>`).join("")}
        </select>
        <input class="a-bank-custom" placeholder="Nama bank/e-wallet lainnya"
          style="margin-top:6px;${a.bank_name === 'Lainnya' ? '' : 'display:none;'}"
          value="${a.bank_name === 'Lainnya' ? (a._custom_name || '') : ''}" />
      </div>
      <div class="field-row two">
        <div class="field"><label>Nomor Rekening / No. HP</label><input class="a-number" value="${a.account_number || ""}" /></div>
        <div class="field"><label>Atas Nama</label><input class="a-holder" value="${a.account_holder || ""}" /></div>
      </div>
    </div>`;
};

// Bind dynamic bank/ewallet switching + "Lainnya" reveal for a single item
window.bindGiftItem = function (item) {
  const typeSelect = item.querySelector(".a-type");
  const bankSelect = item.querySelector(".a-bank");
  const customInput = item.querySelector(".a-bank-custom");

  function refreshBankList() {
    const isBank = typeSelect.value === "Bank Transfer";
    const list = isBank ? window.VINVITE_BANKS : window.VINVITE_EWALLETS;
    bankSelect.innerHTML = list.map(n => `<option value="${n}">${n}</option>`).join("");
    customInput.style.display = "none";
    customInput.value = "";
  }

  function toggleCustom() {
    customInput.style.display = bankSelect.value === "Lainnya" ? "" : "none";
  }

  typeSelect.addEventListener("change", refreshBankList);
  bankSelect.addEventListener("change", toggleCustom);
  item.querySelector(".repeater-remove").onclick = () => item.remove();
};

window.bindAllGiftItems = function () {
  document.querySelectorAll('[data-repeater="gift"]').forEach(window.bindGiftItem);
};

// Collect gift accounts from the repeater
window.collectGiftAccounts = function () {
  return [...document.querySelectorAll('[data-repeater="gift"]')].map(el => {
    let bankName = el.querySelector(".a-bank").value;
    if (bankName === "Lainnya") {
      bankName = el.querySelector(".a-bank-custom").value || "Lainnya";
    }
    return {
      type: el.querySelector(".a-type").value,
      bank_name: bankName,
      account_number: el.querySelector(".a-number").value,
      account_holder: el.querySelector(".a-holder").value,
    };
  });
};
