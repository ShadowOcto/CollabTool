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

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}

function toggleButton() {
    var inputUrl = document.getElementById("linkInput").value;
    var fetchButton = document.getElementById("fetchButton");

    if (isValidUrl(inputUrl)) {
        fetchButton.classList.add("active");
    } else {
        fetchButton.classList.remove("active");
    }
}

document.getElementById("linkInput").addEventListener("input", toggleButton);

function fetchJSON() {
    var inputUrl = document.getElementById("linkInput").value;
    fetch(inputUrl)
        .then(response => {
            if (response.ok) {
                document.getElementById("shareButton").disabled = false; // Enable the share button
                return response.json();
            } else {
                throw new Error("Network response was not ok.");
            }
        })
        .then(data => displayJSONBar(data))
        .catch(error => console.error('Error fetching JSON:', error));
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
    });
}

function shareURL() {
    var inputUrl = document.getElementById("linkInput").value;
    var code = encodeURIComponent(inputUrl);
    var siteUrl = "http://localhost:8000/#";
    var sharedUrl = siteUrl + "?c=" + code;
    
    navigator.clipboard.writeText(sharedUrl)
        .then(() => {
            alert("URL copied to clipboard: " + sharedUrl);
        })
        .catch(err => {
            console.error('Error copying URL to clipboard:', err);
        });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function loadViewPageFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    var code = urlParams.get('c');
    if (code) {
        var inputUrl = decodeURIComponent(code);
        document.getElementById("linkInput").value = inputUrl;
        fetchJSON();
    }
}

window.onload = loadViewPageFromUrl;





