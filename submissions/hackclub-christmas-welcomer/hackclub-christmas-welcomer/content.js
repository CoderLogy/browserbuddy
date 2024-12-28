const cursorPng = chrome.runtime.getURL("images/cursor.png");
const cursorClickedPng = chrome.runtime.getURL("images/cursorclicked.png");
const cursorGrabbedPng = chrome.runtime.getURL("images/cursorgrabbed.png");

const style = document.createElement("style");
style.textContent = `
    * {
        cursor: url(${cursorPng}) , auto !important;
    }

    body:active, *:active {
        cursor: url(${cursorClickedPng}), auto !important;
    }
`;
document.head.appendChild(style);


document.addEventListener("click", () => {
    document.querySelectorAll("*").forEach(el => {
        el.style.cursor = `url(${cursorClickedPng}), auto`;
    });
});

document.addEventListener("dragstart", (event) => {
    if (event.target.tagName === "IMG" || event.target.draggable) {
        document.querySelectorAll("*").forEach(el => {
            el.style.cursor = `url(${cursorGrabbedPng}), grabbing`;
        });
    };
});
document.addEventListener("dragend", (event) => {
        document.querySelectorAll("*").forEach(el => {
            el.style.cursor = `url(${cursorPng}), grabbing`;
        });
});
document.addEventListener("mouseup", () => {
    document.querySelectorAll("*").forEach(el => {
        el.style.cursor = `url(${cursorPng}), auto`;
    });
});

document.addEventListener("mouseout", () => {
    document.querySelectorAll("*").forEach(el => {
        el.style.cursor = `url(${cursorPng}), auto`;  // Reset to original cursor
    });
});

alert(cursorPng);
(() => {
    const today = new Date();
    const december25th = new Date(today.getFullYear(), 11, 25);

    // Choose the appropriate audio file based on the date
    const audioFile = today < december25th ? "audio/christmas.mp3" : "audio/welcometohackclub.mp3";
    const audioURL = chrome.runtime.getURL(audioFile);

    // Check sessionStorage to ensure the audio is only played once
    const isClicked = sessionStorage.getItem("audioClicked");

    if (isClicked === "true") {
        console.log("Audio has already played due to a previous click.");
        return; // Exit if the audio has already been played
    }

    console.log("Waiting for user interaction...");

    // Function to handle click and play audio
    const playOnClick = () => {
        const audio = new Audio(audioURL);
        audio.play().then(() => {
            console.log("Audio is playing after user click.");
            sessionStorage.setItem("audioClicked", "true"); // Save click state
            console.log("SessionStorage updated: audioClicked = true.");
            document.removeEventListener("click", playOnClick); // Remove listener after play
        }).catch((err) => {
            console.error("Failed to play audio:", err);
        });
    };

    // Function to update the event listener based on sound enable/disable state
    const updateSoundState = () => {
        chrome.storage.local.get("isSoundEnabled", function (data) {
            if (data.isSoundEnabled === true) {
                console.log("Sound is enabled. Waiting for user click to play audio.");
                // Add event listener if sound is enabled
                document.addEventListener("click", playOnClick);
            } else {
                console.log("Sound is disabled. No audio will be played.");
                // Remove event listener if sound is disabled
                document.removeEventListener("click", playOnClick);
            }
        });
    };

    // Initial check for sound enabled state
    updateSoundState();

    // Listen for changes to sound setting in the storage
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.isSoundEnabled) {
            updateSoundState(); // Recheck and update event listener when sound setting changes
        }
    });


})();
