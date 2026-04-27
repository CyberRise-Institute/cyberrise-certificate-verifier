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
// 🚀 INIT FIREBASE SAFELY
// ============================
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} catch (e) {
  console.error("Firebase init error:", e);
}

const db = firebase.firestore();

// ============================
// 🔍 VERIFY CERTIFICATE
// ============================
function verifyCert() {
  const id = document.getElementById("certID").value.trim();
  const result = document.getElementById("result");
  const qrBox = document.getElementById("qrcode");

  if (!id) {
    result.innerHTML = "<p style='color:red;'>⚠️ Enter Certificate ID</p>";
    return;
  }

  result.innerHTML = "<p>Checking...</p>";
  qrBox.innerHTML = "";

  db.collection("certificates").doc(id).get()
    .then(doc => {
      if (!doc.exists) {
        result.innerHTML = "<p style='color:red;'>❌ Certificate Not Found</p>";
        return;
      }

      const data = doc.data();

      // ============================
      // 🎓 CERTIFICATE UI
      // ============================
      result.innerHTML = `
        <div id="certificate" class="cert-card" style="
          background: #fff;
          border: 5px solid #16a34a;
          padding: 30px;
          text-align: center;
          font-family: Georgia, serif;
        ">

          <img src="logo.png" style="width:80px; margin-bottom:10px;" />

          <h2 style="color:#16a34a;">CyberRise Institute</h2>
          <p style="font-size:12px;">Certificate of Completion</p>

          <hr>

          <p>This is to certify that</p>

          <h1 style="color:#0f172a;">
            ${data.name || "N/A"}
          </h1>

          <p>has successfully completed</p>

          <h3 style="color:#16a34a;">
            ${data.course || "N/A"}
          </h3>

          <p>Issued: ${data.date || "N/A"}</p>

          <div id="certQR" style="margin-top:20px;"></div>

          <div style="margin-top:30px;">
            <p>_____________________</p>
            <p style="font-size:12px;">Director, CyberRise Institute</p>
          </div>

          <p style="font-size:10px;">ID: ${id}</p>
        </div>

        <button onclick="downloadPDF()" style="margin-top:15px;">
          📄 Download Certificate
        </button>
      `;

      // ============================
      // 🔐 QR GENERATION
      // ============================
      const url = window.location.origin + window.location.pathname + "?id=" + id;

      setTimeout(() => {
        const qrElement = document.getElementById("certQR");
        if (qrElement && window.QRCode) {
          qrElement.innerHTML = "";

          new QRCode(qrElement, {
            text: url,
            width: 100,
            height: 100
          });
        }
      }, 100);

    })
    .catch(err => {
      console.error(err);
      result.innerHTML = "<p style='color:red;'>⚠️ Database Error</p>";
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
    filename: 'CyberRise-Certificate.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 3 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
  };

  html2pdf().set(opt).from(element).save();
}

// ============================
// 🔄 AUTO VERIFY FROM QR LINK
// ============================
window.onload = function () {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
      const input = document.getElementById("certID");
      if (input) {
        input.value = id;
        verifyCert();
      }
    }
  } catch (e) {
    console.error("Auto-load error:", e);
  }
};