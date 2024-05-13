// Made through hours and hours of ChatGPT prompting, probably not the best idea.

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tablink").click();
});

function toggleButton() {
    var input = document.getElementById("linkInput").value;
    var fetchButton = document.getElementById("fetchButton");
    var shareButton = document.getElementById("shareButton");

    fetchButton.classList.toggle("active", input.trim() !== "");
    
    if (isValidUrl(input)) {
        shareButton.disabled = false;
    } else {
        shareButton.disabled = true;
    }
}


document.getElementById("linkInput").addEventListener("input", toggleButton);

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}


function fetchJSON() {
    var input = document.getElementById("linkInput").value;
    if (isValidUrl(input)) {
        fetch(input)
            .then(response => {
                if (response.ok) {
                    showNotification("Loaded from URL: " + input);
                    return response.json();
                } else {
                    throw new Error("Network response was not ok.");
                }
            })
            .then(data => displayJSONBar(data))
            .catch(error => console.error('Error fetching JSON:', error));
    } else {
        handleCode(input);
    }
}


function displayJSONBar(jsonData) {
    var jsonDisplay = document.getElementById("jsonDisplay");
    jsonDisplay.innerHTML = '';

    var barContainer = document.createElement("div");
    barContainer.classList.add("bar-container");
    jsonDisplay.appendChild(barContainer);

    var totalLength = 0;
    jsonData.parts.forEach(part => {
        totalLength += parseInt(part.length);
    });

    var currentOffset = 0;
    jsonData.parts.forEach(part => {
        var barSegment = document.createElement("div");
        barSegment.classList.add("bar-segment");
        barSegment.style.width = (part.length / totalLength) * 100 + "%";
        barSegment.style.backgroundColor = part.color;
        barSegment.style.left = (currentOffset / totalLength) * 100 + "%";
        barContainer.appendChild(barSegment);
        currentOffset += parseInt(part.length);

        barSegment.addEventListener('click', function() {
            displayInfo(part);

            var allBarSegments = document.querySelectorAll('.bar-segment');
            allBarSegments.forEach(seg => {
                seg.classList.remove('selected');
            });

            barSegment.classList.add('selected');
        });
    });

    var totalLengthSeconds = jsonData.parts.reduce((total, part) => total + parseInt(part.length), 0);

    var totalMinutes = Math.floor(totalLengthSeconds / 60);
    var totalSeconds = totalLengthSeconds % 60;

    var totalLengthText = `${totalSeconds < 10 ? '0' : ''}${totalSeconds}s (${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds})`;

    var line = document.querySelector('.line');
    var barInfoLeft = document.querySelector('.bar-info-left');
    var barInfoRight = document.querySelector('.bar-info-right');
    barInfoLeft.textContent = "0s";
    barInfoRight.textContent = totalLengthText;
    line.classList.add("show");

    displayDifficulty(jsonData);
    displayLevelInfo(jsonData);
}

function displayDifficulty(jsonData) {
    var levelDifficulty = document.getElementById("levelDifficulty");
    levelDifficulty.innerHTML = '';

    var img = document.createElement("img");
    img.src = "/faces/" + jsonData.difficulty + ".png";
    img.alt = "Difficulty";
    img.style.width = "50px";
    levelDifficulty.appendChild(img);

    levelDifficulty.classList.add("show");
}

function displayLevelInfo(jsonData) {
    var levelInfoDisplay = document.getElementById("levelInfoDisplay");
    levelInfoDisplay.innerHTML = '';

    var img = document.createElement("img");
    img.src = "https://shadowocto.github.io/CollabTool/faces/" + jsonData.difficulty + ".png";
    img.alt = "Difficulty";
    img.style.width = "50px";

    var name = document.createElement("div");
    name.textContent = "Name: " + jsonData.name;
    levelInfoDisplay.appendChild(name);

    var song = document.createElement("a");
    song.textContent = "Song: " + jsonData.song;
    song.href = jsonData.songURL;
    song.target = "#";
    levelInfoDisplay.appendChild(song);

    var nong = document.createElement("div");
    nong.textContent = "Nong: " + (jsonData.nong ? "Yes" : "No");
    levelInfoDisplay.appendChild(nong);

    var version = document.createElement("div");
    version.textContent = "Version: " + jsonData.version;
    levelInfoDisplay.appendChild(version);

    levelInfoDisplay.classList.add("show");


    var joinButtonContainer = document.getElementById("joinButtonContainer");
    joinButtonContainer.innerHTML = '';

    if (jsonData.invite) {
        var joinButton = document.createElement("a");
        joinButton.target = "_blank";
        joinButton.href = "https://discord.com/invite/" + jsonData.invite;
        joinButton.textContent = "Join";
        joinButton.classList.add("join-button");
        joinButtonContainer.appendChild(joinButton);
    }
}



function displayInfo(part) {
    var infoDisplay = document.getElementById("infoDisplay");
    infoDisplay.innerHTML = '';

    var infoContent = document.createElement("div");
    infoContent.innerHTML = "<strong>Length:</strong> " + part.length + "s<br><strong>Gameplay:</strong> " + part.gameplay;
    
    if (part.gameplayComplete) {
        infoContent.innerHTML += " &#10004;"; // Add a checkmark if gameplay is complete
    }
    
    infoContent.innerHTML += "<br><strong>Decoration:</strong> " + part.decoration;
    
    if (part.decorationComplete) {
        infoContent.innerHTML += " &#10004;"; // Add a checkmark if decoration is complete
    }
    
    infoContent.innerHTML += "<br><strong>Comment:</strong> <span class='comment'>" + part.comment + "</span>";
    
    infoDisplay.appendChild(infoContent);

    infoDisplay.style.borderColor = part.color;

    infoDisplay.classList.add("show");
}

function shareURL() {
    var input = document.getElementById("linkInput").value;
    var code = generateCode(input);
    
    navigator.clipboard.writeText(code)
        .then(() => {
            showNotification("Code copied to clipboard: " + code);
            document.getElementById("shareButton").disabled = false;
        })
        .catch(err => {
            console.error('Error copying code to clipboard:', err);
        });
}

function showNotification(message) {
    var notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("show");

    setTimeout(function() {
        notification.classList.remove("show");
    }, 3000);
}

function encodeUrl(url) {
    var result = '';
    for (var i = 0; i < url.length; i++) {
        var charCode = url.charCodeAt(i);
        charCode = (charCode + 3) % 65536;
        result += String.fromCharCode(charCode);
    }
    return result;
}

function generateCode(url) {
    var hash = encodeUrl(url);
    return "CC" + hash;
}


function handleCode(code) {
    var decodedUrl = decodeCode(code);

    fetch(decodedUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch JSON: " + response.status + " " + response.statusText);
            }
        })
        .then(data => displayJSONBar(data))
        .catch(error => console.error('Error fetching JSON:', error));
}

function decodeCode(encodedUrl) {
    encodedUrl = encodedUrl.substring(2);
    
    var result = '';
    for (var i = 0; i < encodedUrl.length; i++) {
        var charCode = encodedUrl.charCodeAt(i);
        charCode = (charCode - 3) % 65536;
        result += String.fromCharCode(charCode);
    }
    showNotification("Loaded from decoded URL: " + result);
    return result;
}
