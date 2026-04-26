console.log("Script loaded successfully");

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCnAGp4IAiDdAe2cmvhmPYg3PfBc-7Acp4",
  authDomain: "cyberrise-certificates.firebaseapp.com",
  databaseURL: "https://cyberrise-certificates-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cyberrise-certificates",
  storageBucket: "cyberrise-certificates.firebasestorage.app",
  messagingSenderId: "358741421806",
  appId: "1:358741421806:web:5c9105e3ebc85895780dff",
  measurementId: "G-2PDGRCRCHX"
};

// 🚀 Initialize Firebase (Realtime Database)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🔍 Verify Certificate
function verifyCert() {
  const input = document.getElementById("certId");

  if (!input) {
    console.error("certId input not found in HTML");
    return;
  }

  const id = input.value.trim();

  if (!id) {
    document.getElementById("result").innerHTML =
      '<div class="error">⚠️ Please enter a Certificate ID</div>';
    return;
  }

  db.ref("certificates/" + id).get()
    .then(snapshot => {

      if (!snapshot.exists()) {
        document.getElementById("result").innerHTML =
          '<div class="error">❌ Certificate Not Found</div>';
        return;
      }

      const data = snapshot.val();

      document.getElementById("result").innerHTML = `
        <div id="certificate" class="a4-cert">

          <div class="cert-top">
            <p class="subtitle">Official Certificate</p>
          </div>

          <div class="cert-main">
            <h2>Certificate of Completion</h2>

            <p>This certifies that</p>
            <h3>${data.name}</h3>

            <p>has successfully completed</p>
            <h3>${data.course}</h3>

            <div class="meta">
              <div><strong>${data.date}</strong></div>
              <div><strong>${id}</strong></div>
            </div>
          </div>

          <div class="cert-footer">
            <div id="qrcode"></div>
          </div>

        </div>

        <button onclick="downloadPDF()" class="btn">Download PDF</button>
      `;

      // QR CODE (safe check)
      try {
        if (typeof QRCode !== "undefined") {
          new QRCode(document.getElementById("qrcode"), {
            text: window.location.href + "?id=" + id,
            width: 100,
            height: 100
          });
        } else {
          console.warn("QRCode library not loaded");
        }
      } catch (e) {
        console.error("QR error:", e);
      }

    })
    .catch(error => {
      console.error("Firebase error:", error);
      document.getElementById("result").innerHTML =
        '<div class="error">⚠️ Error connecting to database</div>';
    });
}

// 📄 Download PDF (safe check)
function downloadPDF() {
  const element = document.getElementById("certificate");

  if (!element) {
    alert("No certificate found to download");
    return;
  }

  if (typeof html2pdf === "undefined") {
    alert("PDF library not loaded");
    return;
  }

  html2pdf().from(element).save("CyberRise_Certificate.pdf");
}
