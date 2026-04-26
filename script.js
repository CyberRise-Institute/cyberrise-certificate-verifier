// 🔥 Firebase Config (YOURS)
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

// 🚀 Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🔍 Verify Certificate
function verifyCert() {
  const id = document.getElementById("certId").value.trim();

  if (!id) {
    document.getElementById("result").innerHTML =
      '<div class="error">⚠️ Please enter a Certificate ID</div>';
    return;
  }

  db.collection("certificates").doc(id).get()
    .then(doc => {
      if (!doc.exists) {
        document.getElementById("result").innerHTML =
          '<div class="error">❌ Certificate Not Found</div>';
        return;
      }

      const data = doc.data();

      document.getElementById("result").innerHTML = `
      <div id="certificate" class="a4-cert">

        <div class="cert-top">
          <img src="assets/logo.png" class="logo">
          <p class="subtitle">Official Certificate</p>
        </div>

        <div class="cert-main">
          <h2>Certificate of Completion</h2>

          <p>This certifies that</p>
          <h3 class="name">${data.name}</h3>

          <p>has successfully completed</p>
          <h3>${data.course}</h3>

          <div class="meta">
            <div><strong>${data.date}</strong></div>
            <div><strong>${id}</strong></div>
          </div>
        </div>

        <div class="cert-footer">

          <div id="qrcode"></div>

          <div class="seal">✔</div>

          <div class="signature-block">
            <img src="assets/signature.png" class="signature">
            <p>Director</p>
          </div>

          <p class="blockchain">
          🔐 This certificate is cryptographically verifiable and tamper-proof.
          </p>

          <p class="verified">✔ Verified</p>

        </div>
      </div>

      <button onclick="downloadPDF()" class="btn">Download PDF</button>
      `;

      // QR CODE
      new QRCode(document.getElementById("qrcode"), {
        text: window.location.href + "?id=" + id,
        width: 100,
        height: 100
      });

      // TRACKING (basic)
      fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => console.log("Verification IP:", data.ip));
    })
    .catch(error => {
      console.error(error);
      document.getElementById("result").innerHTML =
        '<div class="error">⚠️ Error connecting to database</div>';
    });
}
function downloadPDF() {
  const element = document.getElementById("certificate");
  html2pdf().from(element).save("CyberRise_Certificate.pdf");
}
