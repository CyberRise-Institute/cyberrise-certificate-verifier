console.log("🚀 CyberRise Verification System Loaded");

// Firebase already initialized in firebase.js
const db = firebase.database();

/* ===============================
   VERIFY CERTIFICATE
================================ */
function verifyCert() {
  const input = document.getElementById("certID");
  const id = input ? input.value.trim() : "";

  if (!id) {
    document.getElementById("result").innerHTML =
      "<p class='error'>⚠️ Enter Certificate ID</p>";
    return;
  }

  db.ref("certificates/" + id).get()
    .then(snapshot => {

      if (!snapshot.exists()) {
        document.getElementById("result").innerHTML =
          "<p class='error'>❌ Certificate Not Found</p>";
        return;
      }

      const data = snapshot.val();

      document.getElementById("result").innerHTML = `
        <div class="cert" id="certificate">

          <div class="watermark">CyberRise</div>

          <h2>Certificate of Completion</h2>

          <p>This certifies that</p>
          <div class="name">${data.name}</div>

          <p>has successfully completed</p>
          <h3>${data.course}</h3>

          <p><b>ID:</b> ${id}</p>

          <div class="seal">✔</div>

          <div class="stamp" id="stamp">VERIFIED ✔</div>

          <div id="qrcode"></div>

          <button onclick="downloadPDF()" class="download-btn">
            Download PDF
          </button>
        </div>
      `;

      // QR CODE
      try {
        new QRCode(document.getElementById("qrcode"), {
          text: window.location.href + "?id=" + id,
          width: 110,
          height: 110
        });
      } catch (e) {
        console.warn("QR not loaded");
      }

      // Animate stamp
      setTimeout(() => {
        const stamp = document.getElementById("stamp");
        if (stamp) stamp.classList.add("show");
      }, 400);

      // Track verification (IP log)
      fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(ip => {
          db.ref("verifications").push({
            certId: id,
            ip: ip.ip,
            time: new Date().toISOString()
          });
        });

    })
    .catch(err => {
      console.error(err);
      document.getElementById("result").innerHTML =
        "<p class='error'>⚠️ System Error</p>";
    });
}

/* ===============================
   DOWNLOAD PDF
================================ */
function downloadPDF() {
  const cert = document.getElementById("certificate");

  if (!cert) {
    alert("No certificate to download");
    return;
  }

  if (typeof html2pdf === "undefined") {
    alert("PDF library not loaded");
    return;
  }

  html2pdf().from(cert).save("CyberRise-Certificate.pdf");
}
