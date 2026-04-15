/**
 * Generates a printable job sheet HTML document and opens it in a new window.
 * Completely standalone — no Next.js routing, no auth context dependency.
 */
export function openJobSheet(booking: any) {
  const requestNo = booking._id?.slice(-8).toUpperCase() || "N/A";
  const fullId = booking._id || "";
  const createdDate = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "N/A";
  const createdTime = booking.createdAt
    ? new Date(booking.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "N/A";
  const serviceName = booking.serviceId?.name || "Appliance Repair";
  const serviceTitle = booking.serviceId?.title || serviceName;
  const customerName = booking.userId?.fullName || "—";
  const customerPhone = booking.contactPhone || booking.userId?.phone || "—";
  const customerEmail = booking.userId?.email || "—";
  const address = booking.addressData?.text || "—";
  const pincode = booking.addressData?.zip || "—";
  const description = booking.description || "";
  const status = booking.status || "PENDING";

  const ratingBoxes = Array.from({ length: 11 }, (_, i) =>
    `<div class="rating-box">${i}</div>`
  ).join("");

  const partsRows = [1, 2, 3].map(() =>
    `<tr><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td></tr>`
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Job Sheet — #${requestNo}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', Arial, sans-serif; font-size: 10.5px; line-height: 1.5; color: #111; background: #f0f0f0; }

  .controls {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: #111; color: #fff; padding: 12px 24px;
    display: flex; align-items: center; justify-content: space-between;
    font-family: 'Inter', sans-serif;
  }
  .controls-left { display: flex; align-items: center; gap: 12px; }
  .controls-left span { font-size: 13px; color: #aaa; }
  .ctrl-btn {
    padding: 8px 20px; border-radius: 8px; border: none;
    font-size: 13px; font-weight: 600; cursor: pointer;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .ctrl-primary { background: #C8102E; color: #fff; }
  .ctrl-primary:hover { background: #e0133a; }
  .ctrl-secondary { background: transparent; color: #fff; border: 1px solid #333; }
  .ctrl-secondary:hover { background: #222; }

  .page { padding: 56px 20px 40px; display: flex; justify-content: center; }

  .sheet {
    width: 210mm; min-height: 290mm;
    background: #fff; padding: 28px 32px;
    border: 1px solid #ddd; box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  }

  /* Header */
  .hdr { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .logo { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
  .logo span { color: #C8102E; }
  .tagline { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-top: 2px; }

  /* Info Tables */
  .it { width: 100%; border-collapse: collapse; }
  .it td { padding: 2px 0; vertical-align: top; }
  .lb { font-size: 9px; font-weight: 700; color: #444; white-space: nowrap; padding-right: 8px; }
  .vl { font-size: 10.5px; color: #111; }

  /* Two Col */
  .tc { display: flex; gap: 24px; }
  .cl { flex: 1; }

  /* Divider */
  .dv { border-top: 1px solid #ccc; margin: 10px 0; }

  /* Tables */
  .vt, .pt { width: 100%; border-collapse: collapse; font-size: 9px; }
  .vt th, .pt th {
    background: #f5f5f5; border: 1px solid #ccc; padding: 5px 6px;
    text-align: left; font-weight: 700; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.3px;
  }
  .vt td, .pt td { border: 1px solid #ccc; padding: 8px 6px; min-height: 28px; }
  .pt td { padding: 10px 6px; min-width: 50px; }

  /* Field rows */
  .fr { display: flex; align-items: baseline; gap: 6px; margin-top: 6px; font-size: 10px; }
  .hwl { flex: 1; border-bottom: 1px solid #999; min-height: 18px; }
  .hw { min-height: 20px; }

  /* Total row */
  .tr-row { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 6px; border-top: 1px solid #ccc; font-size: 10px; }

  /* Rating */
  .rating-box { width: 24px; height: 24px; border: 1px solid #999; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; }
  .rating-row { display: flex; gap: 4px; margin-top: 6px; }

  /* Sign row */
  .sr { display: flex; align-items: baseline; gap: 16px; font-size: 10px; }

  /* Tear line */
  .tear { margin: 14px 0; border-top: 2px dashed #999; text-align: center; position: relative; }
  .tear span { position: relative; top: -9px; background: #fff; padding: 0 12px; font-size: 9px; font-weight: 700; color: #888; }

  /* Footer */
  .foot { font-size: 9px; color: #555; text-align: center; line-height: 1.7; }
  .note { margin-top: 6px; font-size: 8px; font-style: italic; color: #999; }

  /* Customer copy */
  .ccopy { padding: 8px 0; font-size: 10px; }

  /* Ref text */
  .ref { font-size: 9px; color: #444; }

  .sat { font-size: 10px; }
  .sat-bold { font-weight: 600; font-style: italic; }

  .comp-section { font-size: 9px; }

  @media print {
    body { background: #fff !important; }
    .controls { display: none !important; }
    .page { padding: 0 !important; margin: 0 !important; }
    .sheet { width: 100% !important; border: none !important; box-shadow: none !important; padding: 16px 20px !important; margin: 0 !important; }
    @page { size: A4; margin: 10mm; }
  }
</style>
</head>
<body>
  <div class="controls">
    <div class="controls-left">
      <span>Job Sheet — #${requestNo}</span>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="ctrl-btn ctrl-primary" onclick="window.print()">🖨 Print</button>
      <button class="ctrl-btn ctrl-secondary" onclick="window.print()">📥 Save as PDF</button>
      <button class="ctrl-btn ctrl-secondary" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="page">
    <div class="sheet">

      <!-- HEADER -->
      <div class="hdr">
        <div>
          <div class="logo">Fixxer<span>.</span></div>
          <p class="tagline">Authorised Home Appliance Service</p>
        </div>
        <div>
          <table class="it">
            <tr><td class="lb">Service Request Type:</td><td class="vl">${serviceName}</td></tr>
            <tr><td class="lb">Customer Type:</td><td class="vl">Home / Residential</td></tr>
            <tr><td class="lb">Dealer Name:</td><td class="vl">—</td></tr>
          </table>
        </div>
      </div>

      <div class="dv"></div>

      <!-- SERVICE INFO -->
      <div class="tc">
        <div class="cl">
          <table class="it">
            <tr><td class="lb">Preferred Date:</td><td class="vl hw">&nbsp;</td></tr>
            <tr><td class="lb">Preferred Time:</td><td class="vl hw">&nbsp;</td></tr>
            <tr><td class="lb">Product Category:</td><td class="vl">${serviceName.toUpperCase()}</td></tr>
            <tr><td class="lb">Product Sub Category:</td><td class="vl">${serviceTitle}</td></tr>
            <tr><td class="lb">Product Code:</td><td class="vl hw">&nbsp;</td></tr>
            <tr><td class="lb">Cabinet Serial Number:</td><td class="vl hw">&nbsp;</td></tr>
            <tr><td class="lb">Trade Partner / Serial No:</td><td class="vl hw">&nbsp;</td></tr>
            <tr><td class="lb">Date of Purchase:</td><td class="vl hw">&nbsp;</td></tr>
          </table>
        </div>
        <div class="cl">
          <table class="it">
            <tr><td class="lb">Service Request No:</td><td class="vl" style="font-weight:700;font-size:13px">${requestNo}</td></tr>
            <tr><td class="lb">Date:</td><td class="vl">${createdDate}</td></tr>
            <tr><td class="lb">Time:</td><td class="vl">${createdTime}</td></tr>
            <tr><td class="lb">Service Type:</td><td class="vl">Service Booking</td></tr>
            <tr><td class="lb">Status:</td><td class="vl">${status}</td></tr>
            <tr><td class="lb">Warranty Code:</td><td class="vl hw">&nbsp;</td></tr>
            <tr><td class="lb">Sale Dt:</td><td class="vl hw">&nbsp;</td></tr>
            <tr><td class="lb">Extended Warranty:</td><td class="vl hw">&nbsp;</td></tr>
          </table>
        </div>
      </div>

      <div class="dv"></div>

      <!-- CUSTOMER INFO -->
      <div class="tc">
        <div class="cl" style="flex:2">
          <table class="it">
            <tr><td class="lb">Name of Customer:</td><td class="vl">${customerName}</td></tr>
            <tr><td class="lb">Account Address:</td><td class="vl">${address}</td></tr>
            <tr><td class="lb">Pincode:</td><td class="vl">${pincode}</td></tr>
            <tr><td class="lb">Customer Contact:</td><td class="vl">${customerPhone}</td></tr>
            <tr><td class="lb">Customer Email:</td><td class="vl">${customerEmail}</td></tr>
            <tr><td class="lb">Alternate Phone:</td><td class="vl hw">&nbsp;</td></tr>
            <tr><td class="lb">Special Instructions:</td><td class="vl">${description}</td></tr>
          </table>
        </div>
        <div class="cl">
          <table class="it">
            <tr><td class="lb">Visit Category:</td><td class="vl hw">&nbsp;</td></tr>
            <tr><td class="lb">Invoice number:</td><td class="vl hw">&nbsp;</td></tr>
            <tr><td class="lb">URl no:</td><td class="vl" style="font-size:9px;word-break:break-all">${fullId}</td></tr>
            <tr><td class="lb">Start Date:</td><td class="vl hw">&nbsp;</td></tr>
            <tr><td class="lb">Expiry Date:</td><td class="vl hw">&nbsp;</td></tr>
          </table>
        </div>
      </div>

      <div class="dv"></div>

      <!-- VISIT 1 -->
      <table class="vt">
        <thead><tr><th style="width:70px">Visit No</th><th>Technician Name</th><th>Visit Date</th><th>Time In</th><th>Time Out</th><th style="width:160px">Tech Remarks &amp; Sign</th></tr></thead>
        <tbody><tr><td>Visit-1</td><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td></tr></tbody>
      </table>
      <div class="fr"><span class="lb" style="min-width:100px">Job Description:</span><span class="hwl">&nbsp;</span></div>

      <!-- VISIT 2 -->
      <table class="vt" style="margin-top:12px">
        <thead><tr><th style="width:70px">Visit No</th><th>Technician Name</th><th>Visit Date</th><th>Time In</th><th>Time Out</th><th style="width:160px">Tech Remarks &amp; Sign</th></tr></thead>
        <tbody><tr><td>Visit-2</td><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td><td class="hw">&nbsp;</td></tr></tbody>
      </table>
      <div class="fr"><span class="lb" style="min-width:100px">Job Description:</span><span class="hwl">&nbsp;</span></div>

      <div class="dv"></div>

      <!-- PARTS TABLE -->
      <table class="pt">
        <thead><tr><th>Part Code</th><th>Part Description</th><th>Def. Rec. Y/N | Defective Item Code and Serial No.</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody>${partsRows}</tbody>
      </table>

      <div class="tr-row">
        <div class="fr" style="flex:1"><span class="lb">Labour(Service) / Transportation charges (if any):</span><span class="hwl" style="width:120px">&nbsp;</span></div>
        <div style="display:flex;align-items:center;gap:8px;font-weight:700"><span>Total:</span><span class="hwl" style="width:120px">&nbsp;</span></div>
      </div>

      <div class="dv"></div>

      <!-- COMPRESSOR -->
      <div class="tc comp-section">
        <div class="cl"><p><strong>Defective Compressor Item code:</strong></p><p><strong>Defective Compressor Serial Number:</strong></p><p><strong>Oil Charging Number:</strong></p></div>
        <div class="cl"><p><strong>Replaced Compressor Item code:</strong></p><p><strong>Replaced Compressor Serial Number:</strong></p></div>
      </div>

      <div class="dv"></div>

      <!-- REFERENCE -->
      <p class="ref">Previous Call reference / Case Number: <strong>${fullId}</strong>, Created Date: <strong>${createdDate}</strong>, Action Code: N/A</p>

      <div class="dv"></div>

      <!-- SATISFACTION -->
      <div class="sat">
        <p class="sat-bold">I am Satisfied with the job done / repairs carried out on my products and since it is working satisfactorily.</p>
        <div class="fr" style="margin-top:6px"><span class="lb">Customer Remarks:</span><span class="hwl">&nbsp;</span></div>
        <p style="margin-top:10px;font-weight:600">On a scale of 0 to 10, how willing are you to recommend <strong>FIXXER APPLIANCE SERVICES</strong> to your family and friends?</p>
        <div class="rating-row">${ratingBoxes}</div>
      </div>

      <div class="dv"></div>

      <!-- SIGNATURE -->
      <div class="sr">
        <div class="fr" style="flex:1"><span class="lb">Customer Name:</span><span class="vl">${customerName}</span></div>
        <div class="fr" style="flex:1"><span class="lb">Customer Sign:</span><span class="hwl" style="width:150px">&nbsp;</span></div>
        <div class="fr"><span class="lb">Customer Happy Code:</span><span class="hwl" style="width:100px">&nbsp;</span></div>
      </div>

      <!-- TEAR LINE -->
      <div class="tear"><span>✂ Tear Here</span></div>

      <!-- CUSTOMER COPY -->
      <div class="ccopy">
        <div class="tc">
          <div class="fr" style="flex:1"><span class="lb">Customer Name:</span><span class="vl">${customerName}</span></div>
          <div class="fr" style="flex:1"><span class="lb">Service Request No:</span><span class="vl" style="font-weight:700">${requestNo}</span></div>
          <div class="fr"><span class="lb">Job is done:</span><span>Yes / No</span></div>
        </div>
        <div class="tc" style="margin-top:6px">
          <div class="fr" style="flex:1"><span class="lb">Tech Name &amp; Sign:</span><span class="hwl" style="width:150px">&nbsp;</span></div>
          <div class="fr" style="flex:1"><span class="lb">Date:</span><span class="hwl" style="width:100px">&nbsp;</span></div>
          <div class="fr"><span class="lb">Amount Collected:</span><span class="hwl" style="width:100px">&nbsp;</span></div>
        </div>
      </div>

      <div class="dv"></div>

      <!-- FOOTER -->
      <div class="foot">
        <p><strong>Authorised Service Provider:</strong> FIXXER HOME APPLIANCE SERVICES</p>
        <p>Contact Center Number: <strong>+91 XXXXXXXXXX</strong> | Website: <strong>www.fixer.in</strong> | Email: <strong>support@fixer.in</strong></p>
        <p class="note">Note: This is a record rendered and is for usage by Authorised service provider only.</p>
      </div>

    </div>
  </div>
</body>
</html>`;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    alert("Please allow popups for this site to print job sheets.");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
}
