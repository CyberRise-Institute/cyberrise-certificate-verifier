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

// 🚀 Initialize Firebase (prevent double init)
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
    document.getElementById("qrcode").innerHTML = "";
    return;
  }

  db.collection("certificates").doc(id).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();

        // ✅ Show certificate
        document.getElementById("result").innerHTML = `
          <div class="cert-card">
            <h2>🎓 Certificate Verified</h2>

            <p style="font-size:12px; color:#64748b;">
              Verified by CyberRise Institute
            </p>

            <p class="cert-name">${data.name}</p>
            <p class="cert-course">${data.course}</p>
            <p class="cert-date">Issued: ${data.date}</p>
            <p class="cert-id">Certificate ID: ${id}</p>
          </div>
        `;

        // 🔗 Create verification URL
        const url =
          window.location.origin +
          window.location.pathname +
          "?id=" +
          encodeURIComponent(id);

        // 🧼 Clear + add label
        document.getElementById("qrcode").innerHTML = `
          <p style="margin-top:10px; font-size:12px; text-align:center;">
            Scan to verify certificate
          </p>
        `;

        // 🔐 Generate QR
        new QRCode(document.getElementById("qrcode"), {
          text: url,
          width: 120,
          height: 120
        });

      } else {
        document.getElementById("result").innerHTML =
          '<div class="error">❌ Certificate Not Found</div>';
        document.getElementById("qrcode").innerHTML = "";
      }
    })
    .catch(error => {
      console.error("Firestore Error:", error);

      document.getElementById("result").innerHTML =
        '<div class="error">⚠️ Error connecting to database</div>';
      document.getElementById("qrcode").innerHTML = "";
    });
}

// 🔄 Auto verify from QR link
window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    document.getElementById("certID").value = id;
    verifyCert();
  }
};
