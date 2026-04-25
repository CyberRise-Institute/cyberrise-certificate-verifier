// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCnAGp4IAiDdAe2cmvhmPYg3PfBc-7Acp4",
  authDomain: "cyberrise-certificates.firebaseapp.com",
  projectId: "cyberrise-certificates"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Verify Function
function verifyCert() {
  const id = document.getElementById("certID").value;

  db.collection("certificates").doc(id).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById("result").innerHTML = `
          <h3>✅ Certificate Verified</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Course:</strong> ${data.course}</p>
          <p><strong>Date:</strong> ${data.date}</p>
        `;
      } else {
        document.getElementById("result").innerHTML = "❌ Certificate Not Found";
      }
    })
    .catch(error => {
      console.error(error);
    });
}