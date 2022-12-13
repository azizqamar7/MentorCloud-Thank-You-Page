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
                sendEmail(url)
            })
            .catch(err => console.log("err"))
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
    displayPlaceholder.setAttribute('class', 'display-msg')
    displayPlaceholder.innerHTML = "Message will appear here"
    cards[i].append(displayPlaceholder)
}

// Get all created <p> element with class="display-msg"
const displayMessage = document.querySelectorAll('.display-msg')

// Change text on input
function inputHandler (e) {
    // console.log(e)
    for (let i = 0; i < displayMessage.length; i++) {
        displayMessage[i].innerText = e.target.value
    }
}

const displayTextCount = document.getElementById('display-textcount');
displayTextCount.style.display = 'none'

// Listen for the 'focus' event on the textarea.
messageInput.addEventListener('focus', function () {
    displayTextCount.style.display = 'block'
})



// Set the maximum character count.
const maxCharacters = 150;

// Listen for the 'input' event on the text field.
messageInput.addEventListener('input', function () {
    // Get the number of characters in the field.
    const characterCount = messageInput.value.length;

    // Calculate the remaining character count.
    const remainingCharacters = maxCharacters - characterCount;

    // Update the remaining character count display.
    document.getElementById('remaining-count').textContent = remainingCharacters;
});

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
                        <p>${fromName} is feeling super grateful for all your guidance, mentorship and care, and sent you this Thank You card.</p>
                        <div> 
                            <p>
                                <img src="${url}" width="250px" />
                                <br></br>
                                <br></br>
                                Thank you once again for creating an impact, ${fromName}'s life and career.
                                <br></br>
                                <br></br>
                                PS: You have someone to thank?
                                <a href="https://thankyou.mentorcloud.com/">
                                    Click here
                                </a>
                                 to send them a thank you card.
                                <br></br>
                                <br></br>
                                <small>The Gratitude Movement by MentorCloud</small>
                                <br></br>
                                <img src="https://assets.website-files.com/5f97aed45612e672a043c898/637dc5b342ffe87ae166c71e_MentorCloud_Logo_Original_Shamrock-p-500.png" />
                                <br></br>
                                <br></br>
                                <a href="https://www.mentorcloud.com/">
                                    Impacting 100 million lives
                                </a>
                                <br></br>
                                <br></br>
                                <small>Note: Replying to this message will not be sent to ${fromName}</small>
                                <br></br>
                                <small>The Contents of this email may be legally privileged, confidential and also subject to copyright. If you believe you’re not the intended recipient of this email, I request you to inform us post which permanently delete the Contents of this email and not share or use it for any purposes.</small>
                            </p>
                        </div>
                    </html>`

    Email.send({
        SecureToken: "4a6bb94a-e8de-4577-a76a-2462fde2338e",
        To: email,
        From: 'MentorCloud <talktous@mentorcloud.com>',
        Subject: `${toName}, ${fromName} sent you a Thank You card.`,
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
    const cardCheckMsg = document.getElementById('card-check-msg')

    // Function to validate the group of card elements
    function validateCards () {
        // Use querySelectorAll() to find all of the card elements with the selected class
        const selectedCards = document.querySelectorAll('.c_slide-selector.current');
        // Check the length of the returned node list
        if (selectedCards.length === 1) {
            // Exactly one card element has been selected, the group is valid
            const markedChecked = selectedCards[0]
            cardCheckMsg.hidden = true
            sendBtn.value = 'Please wait...'
            cardsToCanvas(markedChecked)
        } else {
            // None or more than one of the card elements have been selected, the group is invalid
            cardCheckMsg.hidden = false
        }
    }

    validateCards()
}





//events 
fromInputName.addEventListener('input', fromNameHandler)
toInputName.addEventListener('input', toNameHandler)
messageInput.addEventListener('input', inputHandler)

sendAnotherBtn.addEventListener('click', () => {
    const successBlock = document.getElementById('success')
    const formBlock = document.getElementById('form')
    const form = document.getElementById('email-form')
    const cardCheckMsg = document.getElementById('card-check-msg')
    sendBtn.value = 'Send thank you card'

    // Reset display message
    for (let i = 0; i < displayMessage.length; i++) {
        displayMessage[i].textContent = 'Message will appear here'
    }
    document.getElementById('remaining-count').textContent = maxCharacters

    formBlock.style.display = 'block'
    form.reset()
    successBlock.style.display = 'none'
    cardCheckMsg.hidden = true
})

// Get the form element
var form = document.getElementById("form");

// Create a submit event handler that checks the form validity
form.addEventListener("submit", function (event) {
    // Check if the form is valid
    if (!form.checkValidity) {
        // Prevent the form from being submitted
        event.preventDefault();
    }

    passOnClick()
});