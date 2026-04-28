// ============================
// 🔥 FIREBASE CONFIG
// ============================
const firebaseConfig = {
  apiKey: "AIzaSyCnAGp4IAiDdAe2cmvhmPYg3PfBc-7Acp4",
  authDomain: "cyberrise-certificates.firebaseapp.com",
  databaseURL: "https://cyberrise-certificates-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cyberrise-certificates",
  storageBucket: "cyberrise-certificates.firebasestorage.app",
  messagingSenderId: "358741421806",
  appId: "1:358741421806:web:5c9105e3ebc85895780dff"
};

// ============================
// 🚀 INIT FIREBASE
// ============================
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ============================
// 🔍 VERIFY CERTIFICATE
// ============================
function verifyCert() {
  const id = document.getElementById("certID").value.trim();
  const result = document.getElementById("result");

  if (!id) {
    result.innerHTML = "<p style='color:red;'>⚠️ Enter Certificate ID</p>";
    return;
  }

  result.innerHTML = "<p>Checking certificate...</p>";

  db.collection("certificates").doc(id).get()
    .then(doc => {
      if (!doc.exists) {
        result.innerHTML = "<p style='color:red;'>❌ Certificate Not Found</p>";
        return;
      }

      const data = doc.data();

      // ============================
      // 🎓 CERTIFICATE DESIGN
      // ============================
      result.innerHTML = `
        <div id="certificate" class="exact-cert">

          <div class="wave wave-tl"></div>
          <div class="wave wave-br"></div>

          <div class="dots dots-left"></div>
          <div class="dots dots-right"></div>

          <div class="cert-card">

            <img src="seal.png" class="seal" />

            <h1 class="cert-title">CERTIFICATE</h1>
            <p class="cert-sub">OF COMPLETION</p>

            <p class="cert-intro">This certificate is proudly presented to:</p>

            <h2 class="cert-name">${data.name || "N/A"}</h2>

            <div class="divider"></div>

            <p class="cert-desc">
              In recognition of successful completion of
            </p>

            <h3 class="cert-course">${data.course || "N/A"}</h3>

            <p class="cert-desc">Issued by CyberRise Institute</p>

            <!-- 🔐 QR -->
            <div id="certQR" style="margin-top:20px;"></div>

            <div class="cert-footer">

              <div class="foot-block">
                <p class="foot-date">${data.date || "N/A"}</p>
                <span>Date</span>
              </div>

              <div class="foot-block">
                <img src="signature.png" class="sign" />
                <span>Director</span>
              </div>

            </div>

            <p class="cert-id">Certificate ID: ${id}</p>

          </div>
        </div>

        <button onclick="downloadPDF()" class="download-btn">
          📄 Download Certificate
        </button>
      `;

      // ============================
      // 🔗 QR GENERATION
      // ============================
      const url = window.location.origin + window.location.pathname + "?id=" + id;

      setTimeout(() => {
        const qrBox = document.getElementById("certQR");

        if (qrBox && window.QRCode) {
          qrBox.innerHTML = "";
          new QRCode(qrBox, {
            text: url,
            width: 100,
            height: 100
          });
        }
      }, 100);

    })
    .catch(err => {
      console.error(err);
      result.innerHTML = "<p style='color:red;'>⚠️ Database error</p>";
    });
}

// ============================
// 📄 DOWNLOAD PDF
// ============================
function downloadPDF() {
  const element = document.getElementById("certificate");

  if (!element) {
    alert("No certificate to download");
    return;
  }

  const opt = {
    margin: 0,
    filename: "CyberRise-Certificate.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 3,
      useCORS: true
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "landscape"
    }
  };

  html2pdf().set(opt).from(element).save();
}

// ============================
// 🔄 AUTO VERIFY FROM QR LINK
// ============================
window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    const input = document.getElementById("certID");
    if (input) {
      input.value = id;
      verifyCert();
    }
  }
};
