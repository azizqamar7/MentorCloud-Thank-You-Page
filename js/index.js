// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD7D0f7Qt9z5PVnEM1qdLhUZBgaMG3dlAk",
    authDomain: "store-canvas-images.firebaseapp.com",
    projectId: "store-canvas-images",
    storageBucket: "store-canvas-images.appspot.com",
    messagingSenderId: "877456558384",
    appId: "1:877456558384:web:449a2e6c65d86b5b8420f5",
    measurementId: "G-JD8J9MFHH9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app)



// Fetch Inputs
const cards = document.querySelectorAll('.c_slide-selector')
var fromInputName = document.getElementById('from-name')
var toInputName = document.getElementById('to-name')
var messageInput = document.getElementById('thankyou-msg')
const sendBtn = document.getElementById('send-btn')
const sendAnotherBtn = document.getElementById('send-another')


// Upload to Firbase Storage
function uploadImage () {
    const fileName = Date.now() + '-' + 'base64' // Give a name to a file
    const imgRef = ref(storage, fileName);

    uploadString(imgRef, dataUrl, 'data_url').then((snapshot) => {
        getDownloadURL(ref(snapshot.ref))
            .then(url => {
                console.log(url)
                sendEmail(url)
            })
            .catch(err => console.log("err"))
        console.log(snapshot);
    });
}

// Apply Current Class to Card
for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', function () {
        var current = document.querySelectorAll('.current')
        if (current.length > 0) {
            current[0].className = current[0].className.replace(' current', '')
        }
        this.className += ' current'
    })
}

// Create <p> element across the cards
for (let i = 0; i < cards.length; i++) {
    const displayPlaceholder = document.createElement('p')
    // const displayPlaceholder = document.querySelector('.display-msg')
    displayPlaceholder.setAttribute('class', 'display-msg')
    displayPlaceholder.textContent = "Message will appear here"
    cards[i].append(displayPlaceholder)
}

// Get all created <p> element with class="display-msg"
const displayMessage = document.querySelectorAll('.display-msg')

// Change text on input
function inputHandler (e) {
    for (let i = 0; i < displayMessage.length; i++) {
        displayMessage[i].textContent = e.target.value
    }
}

// Change names on input after submission of form
function fromNameHandler (e) {
    var displayFromName = document.getElementById('display-from-name')
    displayFromName.textContent = e.target.value
}

function toNameHandler (e) {
    var displayToName = document.getElementById('display-to-name')
    displayToName.textContent = e.target.value
}

// Convert HTML cards to canvas
let dataUrl
function cardsToCanvas (markedChecked) {
    html2canvas(markedChecked).then(canvas => {
        dataUrl = canvas.toDataURL('image/png')

        const image = new Image()
        image.setAttribute('src', dataUrl)
        image.setAttribute('id', 'card-img')

        uploadImage()
    })
}


// Send Email Function
function sendEmail (url) {
    // e.preventDefault()
    var message = $('#thankyou-msg').val();
    var email = $('#recipient-email').val();
    var toName = $('#to-name').val();
    var fromName = $('#from-name').val();


    var emailBody = `<html> 
                        <p>Dear ${toName}</p>
                        <p>We, at MentorCloud, are so grateful for each of the wisdom you bring to our community.<br></br> ${fromName}</p>
                        <strong>On this day, ${fromName} has sent you a message.</strong>
                        <br></br>
                        <div> 
                            <p>
                                ${message}
                                <br></br>
                                <br></br>
                                <img src="${url}" />
                                <br></br>
                                <br></br>
                                Thank you once again for creating an impact, ${fromName}.
                                <br></br>
                                <br></br>
                                Hope this message fills your heart with gratitude. Please pass along this act of gratitude to somebody who has helped you.
                                <a href="https://www.mentorcloud.com/thankyou">
                                    Click here.
                                </a>
                                <br></br>
                                <br></br>
                                Note: Replying to this message will not be sent to ${fromName}
                                <br></br>
                                <br></br>
                                Happy Mentoring!
                                <br></br>
                                <br></br>
                                <img src="https://assets.website-files.com/5f97aed45612e672a043c898/637dc5b342ffe87ae166c71e_MentorCloud_Logo_Original_Shamrock-p-500.png" />
                                <br></br>
                                <br></br>
                                <a href="https://www.mentorcloud.com/">
                                    Impacting 100 million lives
                                </a>
                                <br></br>
                                <br></br>
                                The Contents of this email may be legally privileged, confidential and also subject to copyright. If you believe you’re not the intended recipient of this email, I request you to inform us post which permanently delete the Contents of this email and not share or use it for any purposes.
                            </p>
                        </div>
                    </html>`

    Email.send({
        SecureToken: "4c70682b-f333-4d48-93f9-d1ebc5c61973",
        To: email,
        From: 'azizqamar7@gmail.com',
        Subject: `${toName}, ${fromName} has a message for you!`,  // [Receivers Name], [Sender Name] has a message for you!
        Body: emailBody
    }).then(
        message => {
            const successBlock = document.getElementById('success')
            const formBlock = document.getElementById('form')
            formBlock.style.display = 'none'
            successBlock.style.display = 'block'
        }
    ).catch(err => {
        const errorMsg = document.getElementById('error-msg')
        errorMsg.hidden = false
    });
}

// Pass individual card on send
function passOnClick () {
    const markedChecked = document.querySelector('.c_slide-selector.current')
    const cardCheckMsg = document.getElementById('card-check-msg')

    // Validate cards & pass the current card to the function
    for (let i = 0; i < cards.length; i++) {
        if (cards[i] == markedChecked) {
            cardsToCanvas(markedChecked)
        }
        else {
            cardCheckMsg.hidden = false
        }
    }
}

//events 
fromInputName.addEventListener('input', fromNameHandler)
toInputName.addEventListener('input', toNameHandler)
messageInput.addEventListener('input', inputHandler)
sendBtn.addEventListener('click', passOnClick)
sendAnotherBtn.addEventListener('click', () => {
    const successBlock = document.getElementById('success')
    const formBlock = document.getElementById('form')
    const form = document.getElementById('email-form')
    const cardCheckMsg = document.getElementById('card-check-msg')
    formBlock.style.display = 'block'
    form.reset()
    successBlock.style.display = 'none'
    cardCheckMsg.hidden = true
})