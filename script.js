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

// 🚀 Initialize Firebase safely
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 🔍 Verify Certificate
function verifyCert() {
  const id = document.getElementById("certID").value.trim();

  if (!id) {
    document.getElementById("result").innerHTML =
      '<div class="error">⚠️ Please enter a Student ID</div>';
    return;
  }

  db.collection("certificates").doc(id).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();

        // 🎓 Luxury Certificate Display
        document.getElementById("result").innerHTML = `
          <div id="certificate" class="cert-card" style="
            background: #fff;
            border: 5px solid #16a34a;
            padding: 30px;
            text-align: center;
            font-family: Georgia, serif;
          ">

            <img src="logo.png" style="width:80px; margin-bottom:10px;" />

            <h2 style="margin:0; color:#16a34a;">CyberRise Institute</h2>
            <p style="font-size:12px; letter-spacing:1px;">Certificate of Completion</p>

            <hr style="margin:20px 0;">

            <p>This is to certify that</p>

            <h1 style="margin:10px 0; color:#0f172a;">
              ${data.name}
            </h1>

            <p>has successfully completed</p>

            <h3 style="color:#16a34a;">
              ${data.course}
            </h3>

            <p style="margin-top:10px;">Issued: ${data.date}</p>

            <!-- 🔐 QR inside certificate -->
            <div id="certQR" style="margin-top:20px;"></div>

            <!-- ✍ Signature -->
            <div style="margin-top:30px;">
              <p>________________________</p>
              <p style="font-size:12px;">Director, CyberRise Institute</p>
            </div>

            <p style="margin-top:10px; font-size:10px;">
              Certificate ID: ${id}
            </p>

          </div>

          <button onclick="downloadPDF()" style="margin-top:15px;">
            📄 Download Certificate
          </button>
        `;

        // 🔗 Generate verification URL
        const url =
          window.location.origin +
          window.location.pathname +
          "?id=" +
          encodeURIComponent(id);

        // 🔐 Generate QR inside certificate
        document