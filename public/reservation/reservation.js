// const { response } = require("express");

// Get today's date in yyyy-mm-dd format
const today = new Date().toISOString().split('T')[0];
// Set the min attribute of the date input to today
document.getElementById('date').setAttribute('min', today);

console.log("Client script loaded.");

// Function to check if a date is a Saturday
function isSaturday(date) {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 6; // 6 represents Saturday (0 is Sunday, 1 is Monday, ..., 6 is Saturday)
}

document.querySelector('.back-button').addEventListener('click', function () {
    history.back(); // Go back to the previous page
});

const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const seatContainer = document.querySelector(".seating-container");
const countElement = document.getElementById("count1");
const totalElement = document.getElementById("total1");

// Update the selected seats count and total price
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");
    const selectedSeatsCount = selectedSeats.length;

    console.log("Selected seats count:", selectedSeatsCount);

    // Determine the price based on the selected table subtitle
    let price = 0;
    const sectionContainers = document.querySelectorAll(".section");
    sectionContainers.forEach(container => {
        const subtitle = container.querySelector(".subtitle");
        const sectionSeats = container.querySelectorAll(".row .seat.selected");
        if (sectionSeats.length > 0) {
            if (subtitle.textContent === "For 2 to 4 Guests") {
                price = 599;
            } else if (subtitle.textContent === "For 5 to 8 Guests") {
                price = 899;
            } else if (subtitle.textContent === "For 9 to 12 Guests") {
                price = 1199;
            }
        }
    });

    const totalPrice = selectedSeatsCount * price;

    // Update the UI with the count and total price
    countElement.textContent = selectedSeatsCount;
    totalElement.textContent = totalPrice;

    // Save the selected seats to local storage
    saveSelectedSeats();
}

// Save the selected seats to local storage
function saveSelectedSeats() {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");
    const seatsIndex = Array.from(selectedSeats).map(seat => seat.dataset.number);
    localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

    console.log("Selected seats saved to local storage.");
}

// Populate the UI with data from local storage
function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

    if (selectedSeats && selectedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if (selectedSeats.includes(seat.dataset.number)) {
                seat.classList.add("selected");
            }
        });
    }

    console.log("UI populated with data from local storage.");
}

// Event delegation for seat selection
seatContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("seat") && !e.target.classList.contains("occupied")) {
        e.target.classList.toggle("selected");
        updateSelectedCount();
    }
});

// Initialize the UI
populateUI();
updateSelectedCount(); // Added to ensure count and total are updated on page load

document.querySelector('#reserve-button').addEventListener('click', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const selectedSeat = document.querySelector('.row .seat.selected');
    const tableNumber = selectedSeat ? selectedSeat.dataset.number : null;

    console.log("Name:", name); // Check if name is correct
    console.log("Email:", email); // Check if email is correct
    console.log("Date:", date); // Check if date is correct
    console.log("Time:", time); // Check if time is correct
    console.log("Table Number:", tableNumber); // Check if table number is correct

    if (!tableNumber) {
        console.error("Table number is undefined. Please select a table.");
        return;
    }

    /***const reservation = {
        name: name,
        email: email,
        date: date,
        time: time,
        tableNumber: tableNumber
    };***/

   /** fetch('/reserve_table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, email, date, time, tableNumber})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
        alert("Reservation successful!");
        // Optionally, perform actions after successful reservation
    })
    .catch(error => {
        console.error('Error:', error.message); // Log the error message instead
        // Optionally, handle errors
    });***/

    /***try{
        const response = await fetch('/reserve_table', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, date, time, tableNumber})
        });

        if (response.ok){
            alert('Table reserved succesfully.')
        }else{
            alert('Failed to reservetable.')
        }
    } catch(error){
        console.log('Fetch error: ', error);
    }
    
});*/
var data = [
    { 
        userName: name, 
        emailAddress: email, 
        date: date, 
        time: time,
        tableNumber: tableNumber
    }
];

fetch('/sendData', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => {
    if (response.ok) {
        console.log("Data sent successfully");
    } else {
        console.error("Failed to send data");
    }
})
.catch(error => {
    console.error("Error:", error);
});


});
