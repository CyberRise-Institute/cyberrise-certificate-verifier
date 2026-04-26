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
  const id = document.getElementById("certID").value.trim();

  if (!id) {
    document.getElementById("result").innerHTML = `
  <div class="cert-card">
    <h2>🎓 Certificate Verified</h2>
    <p class="cert-name">${data.name}</p>
    <p class="cert-course">${data.course}</p>
    <p class="cert-date">Issued: ${data.date}</p>
    <p class="cert-id">ID: ${id}</p>
  </div>
`;
      } else {
        document.getElementById("result").innerHTML =
          '<div class="error">❌ Certificate Not Found</div>';
      }
    })
    .catch(error => {
      console.error(error);
      document.getElementById("result").innerHTML =
        '<div class="error">⚠️ Error connecting to database</div>';
    });
}
