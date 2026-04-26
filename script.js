console.log("🚀 CyberRise Verification Loaded");

// ===============================
// NORMALIZE FUNCTION
// ===============================
function normalize(id) {
  return id.toString().trim().toLowerCase();
}

// ===============================
// VERIFY CERTIFICATE
// ===============================
function normalize(v) {
  return (v || "").toString().trim().toLowerCase();
}

function verifyCert() {
  const input = document.getElementById("certID");
  const id = normalize(input.value);

  if (!id) {
    document.getElementById("result").innerHTML =
      "<p class='error'>⚠️ Enter Certificate ID</p>";
    return;
  }

  db.ref("certificates").once("value")
    .then(snapshot => {

      if (!snapshot.exists()) {
        document.getElementById("result").innerHTML =
          "<p class='error'>❌ No certificates found</p>";
        return;
      }

      let found = null;
      let foundKey = null;

      snapshot.forEach(child => {
        const key = normalize(child.key);

        if (key === id) {
          found = child.val();
          foundKey = child.key;
        }
      });

      if (!found) {
        document.getElementById("result").innerHTML =
          "<p class='error'>❌ Certificate Not Found</p>";
        return;
      }

      document.getElementById("result").innerHTML = `
        <div class="cert" id="certificate">

          <div class="watermark">CyberRise</div>

          <h2>Certificate Verified</h2>

          <div class="name">${found.name}</div>

          <p>${found.course}</p>

          <p><b>ID:</b> ${foundKey}</p>

          <div class="seal">✔</div>

          <div class="stamp show">VERIFIED ✔</div>

          <div id="qrcode"></div>

          <button onclick="downloadPDF()" class="download-btn">
            Download PDF
          </button>
        </div>
      `;

      setTimeout(() => {
        if (typeof QRCode !== "undefined") {
          new QRCode(document.getElementById("qrcode"), {
            text: window.location.href + "?id=" + foundKey,
            width: 110,
            height: 110
          });
        }
      }, 300);

    })
    .catch(err => {
      console.error(err);
      document.getElementById("result").innerHTML =
        "<p class='error'>⚠️ Firebase connection failed</p>";
    });
}
      });

      // ===============================
      // SUCCESS UI (CERTIFICATE)
      // ===============================
      document.getElementById("result").innerHTML = `
        <div class="cert" id="certificate">

          <div class="watermark">CyberRise</div>

          <h2>Certificate of Completion</h2>

          <p>This certifies that</p>
          <div class="name">${found.name}</div>

          <p>has successfully completed</p>
          <h3>${found.course}</h3>

          <p><b>ID:</b> ${foundKey}</p>

          <div class="seal">✔</div>

          <div class="stamp" id="stamp">VERIFIED ✔</div>

          <div id="qrcode"></div>

          <button onclick="downloadPDF()" class="download-btn">
            Download PDF
          </button>
        </div>
      `;

      // ===============================
      // QR CODE
      // ===============================
      try {
        if (typeof QRCode !== "undefined") {
          new QRCode(document.getElementById("qrcode"), {
            text: window.location.href + "?id=" + foundKey,
            width: 110,
            height: 110
          });
        }
      } catch (e) {
        console.warn("QR error:", e);
      }

      // ===============================
      // ANIMATE VERIFIED STAMP
      // ===============================
      setTimeout(() => {
        const stamp = document.getElementById("stamp");
        if (stamp) stamp.classList.add("show");
      }, 400);

      // ===============================
      // LOG VERIFICATION (IP TRACKING)
      // ===============================
      fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(ip => {
          db.ref("verifications").push({
            certId: foundKey,
            searchedAs: id,
            time: new Date().toISOString(),
            ip: ip.ip
          });
        });

    })
    .catch(err => {
      console.error(err);
      document.getElementById("result").innerHTML =
        "<p class='error'>⚠️ System Error</p>";
    });
}

// ===============================
// DOWNLOAD PDF FUNCTION
// ===============================
function downloadPDF() {
  const cert = document.getElementById("certificate");

  if (!cert) {
    alert("❌ No certificate found");
    return;
  }

  if (typeof html2pdf === "undefined") {
    alert("❌ PDF library not loaded");
    return;
  }

  html2pdf()
    .set({
      margin: 0,
      filename: "CyberRise-Certificate.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" }
    })
    .from(cert)
    .save();
}
