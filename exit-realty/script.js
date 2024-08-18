// Password protection
const correctPassword = "SalesTug";
const passwordOverlay = document.getElementById('password-overlay');
const passwordInput = document.getElementById('password-input');
const passwordSubmit = document.getElementById('password-submit');
const dashboardContent = document.querySelector('.box');

passwordSubmit.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

function checkPassword() {
    if (passwordInput.value === correctPassword) {
        passwordOverlay.style.display = 'none';
        dashboardContent.style.display = 'block';
    } else {
        alert('Incorrect password. Please try again.');
        passwordInput.value = '';
    }
}

function showRecordings(folderName) {
    let recordingsHTML = ``;
    
    switch(folderName) {
        case 'f1':
            recordingsHTML += createAudioElement('https://auth.vapi.ai/storage/v1/object/public/recordings/5845d9f6-09c2-4c9d-90d9-9c77a1918c8f-1720017518524-a53b196b-478d-4321-bf9c-351f8a2ee6fc-stereo.wav', 'Wednesday @ 01:16PM | Cost:$0.9 ($0.3/min)');
            recordingsHTML += createAudioElement('1.mp3', 'Wednesday @ 04:20PM');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 2');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 3');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 4');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 5');
            break;
        case 'f2':
            recordingsHTML += createAudioElement('1.mp3', 'Recording 1');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 2');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 3');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 4');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 5');
            break;
        case 'f3':
            recordingsHTML += createAudioElement('1.mp3', 'Recording 1');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 2');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 3');
            break;
        case 'f4':
            recordingsHTML += createAudioElement('1.mp3', 'Recording 1');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 2');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 3');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 4');
            break;
        case 'f5':
            recordingsHTML += createAudioElement('1.mp3', 'Recording 1');
            recordingsHTML += createAudioElement('1.mp3', 'Recording 2');
            break;
        default:
            recordingsHTML += '<p>No recordings available for this day.</p>';
    }
    
    document.getElementById('recordings-container').innerHTML = recordingsHTML;
}

function createAudioElement(src, name) {
    return `
        <div class="audio-container">
            <p class="audio-name">${name}</p>
            <audio controls>
                <source src="${src}" type="audio/mp3">
                Your browser does not support the audio element.
            </audio>
        </div>
    `;
}

function showAppointments(folderName) {
    let appointmentsHTML = ``;
    
    switch(folderName) {
        case 'as1':
            appointmentsHTML += createAppointmentElement('John Doe', '10:00 AM', 'Sales Call', 'john.doe@gmail.com', '555-123-4567');
            appointmentsHTML += createAppointmentElement('Jane Smith', '2:30 PM', 'Product Demo', 'jane.smith@gmail.com', '555-234-5678');
            appointmentsHTML += createAppointmentElement('Bob Johnson', '4:45 PM', 'Follow-up', 'bob.johnson@gmail.com', '555-345-6789');
            break;
        case 'as2':
            appointmentsHTML += createAppointmentElement('Alice Brown', '9:15 AM', 'Initial Consultation', 'alice.brown@gmail.com', '555-456-7890');
            appointmentsHTML += createAppointmentElement('Charlie Davis', '1:00 PM', 'Contract Signing', 'charlie.davis@gmail.com', '555-567-8901');
            break;
        case 'as3':
            appointmentsHTML += createAppointmentElement('Eva White', '11:30 AM', 'Sales Pitch', 'eva.white@gmail.com', '555-678-9012');
            appointmentsHTML += createAppointmentElement('Frank Miller', '3:45 PM', 'Product Showcase', 'frank.miller@gmail.com', '555-789-0123');
            appointmentsHTML += createAppointmentElement('Grace Lee', '5:00 PM', 'Q&A Session', 'grace.lee@gmail.com', '555-890-1234');
            break;
        case 'as4':
            appointmentsHTML += createAppointmentElement('Henry Wilson', '10:45 AM', 'Introductory Call', 'henry.wilson@gmail.com', '555-901-2345');
            appointmentsHTML += createAppointmentElement('Ivy Taylor', '2:15 PM', 'Feature Presentation', 'ivy.taylor@gmail.com', '555-012-3456');
            break;
        case 'as5':
            appointmentsHTML += createAppointmentElement('Jack Anderson', '9:30 AM', 'Sales Meeting', 'jack.anderson@gmail.com', '555-123-4567');
            appointmentsHTML += createAppointmentElement('Kelly Martin', '1:30 PM', 'Product Training', 'kelly.martin@gmail.com', '555-234-5678');
            appointmentsHTML += createAppointmentElement('Liam Harris', '4:00 PM', 'Closing Deal', 'liam.harris@gmail.com', '555-345-6789');
            break;
        default:
            appointmentsHTML += '<p>No appointments scheduled for this day.</p>';
    }
    
    document.getElementById('appointments-container').innerHTML = appointmentsHTML;
}

function createAppointmentElement(name, time, description, email, phone) {
    return `
        <div class="appointment-container">
            <p class="appointment-name">${name}</p>
            <p>${time} - ${description}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
        </div>
    `;
}

function showContent(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').style.display = 'none';
        document.querySelector('.close-button').style.display = 'none';
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const closeButton = document.querySelector('.close-button');

    if (sidebar.style.display === 'block') {
        sidebar.style.display = 'none';
        closeButton.style.display = 'none';
    } else {
        sidebar.style.display = 'block';
        closeButton.style.display = 'block';
    }
}

function closeSidebar() {
    document.querySelector('.sidebar').style.display = 'none';
    document.querySelector('.close-button').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    function getValueFromElement(selector) {
        const element = document.querySelector(selector);
        return parseInt(element.textContent.match(/\d+/)[0]);
    }

    var dailyCallSummaryCtx = document.getElementById('dailyCallSummaryChart').getContext('2d');
    var dailyCallSummaryChart = new Chart(dailyCallSummaryCtx, {
        type: 'bar',
        data: {
            labels: ['Total Calls Made', 'Successful Connections', 'Not Answered'],
            datasets: [{
                label: 'Count',
                data: [
                    getValueFromElement('#daily-call-summary [data-total-calls]'),
                    getValueFromElement('#daily-call-summary [data-successful-connections]'),
                    getValueFromElement('#daily-call-summary [data-not-answered]')
                ],
                backgroundColor: ['#4682B4', '#FFA07A', '#808080']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    var callOutcomesCtx = document.getElementById('callOutcomesChart').getContext('2d');
    var callOutcomesChart = new Chart(callOutcomesCtx, {
        type: 'bar',
        data: {
            labels: ['Uninterested Leads', 'Transfered Calls', 'Appointments Scheduled'],
            datasets: [{
                label: 'Count',
                data: [
                    getValueFromElement('#call-outcomes [data-uninterested-leads]'),
                    getValueFromElement('#call-outcomes [data-transfered-calls]'),
                    getValueFromElement('#call-outcomes [data-appointments-scheduled]')
                ],
                backgroundColor: ['#4682B4', '#FFA07A', '#808080']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    var leadStatusCtx = document.getElementById('leadStatusChart').getContext('2d');
    var leadStatusChart = new Chart(leadStatusCtx, {
        type: 'pie',
        data: {
            labels: ['Qualified leads', 'Unqualified leads', 'Yet to be Contacted(60,000)'],
            datasets: [{
                label: 'Count',
                data: [
                    getValueFromElement('#lead-status [data-qualified-leads]'),
                    getValueFromElement('#lead-status [data-unqualified-leads]'),
                    getValueFromElement('#lead-status [data-yet-to-be-contacted]')
                ],
                backgroundColor: ['#4682B4', '#FFA07A', '#808080']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    var responseRateCtx = document.getElementById('responseRateChart').getContext('2d');
    var responseRateChart = new Chart(responseRateCtx, {
        type: 'pie',
        data: {
            labels: ['Calls Answered', 'Calls Resulting in Conversation', 'Calls Leading to Positive Outcome'],
            datasets: [{
                label: 'Percentage',
                data: [
                    getValueFromElement('#response-rate [data-calls-answered]'),
                    getValueFromElement('#response-rate [data-calls-conversation]'),
                    getValueFromElement('#response-rate [data-calls-positive-outcome]')
                ],
                backgroundColor: ['#4682B4', '#FFA07A', '#808080']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    var appointmentSchedulingCtx = document.getElementById('appointmentSchedulingChart').getContext('2d');
    var appointmentSchedulingChart = new Chart(appointmentSchedulingCtx, {
        type: 'pie',
        data: {
            labels: ['Appointments Scheduled', 'Scheduled Appointments Details', 'AI-made Appointments'],
            datasets: [{
                label: 'Count',
                data: [20, 10, 5],
                backgroundColor: ['#4682B4', '#FFA07A', '#808080']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    var performanceMetricsCtx = document.getElementById('performanceMetricsChart').getContext('2d');
    var performanceMetricsChart = new Chart(performanceMetricsCtx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Performance Metrics',
                data: [
                    getValueFromElement('#performance-data [data-day1]'),
                    getValueFromElement('#performance-data [data-day2]'),
                    getValueFromElement('#performance-data [data-day3]'),
                    getValueFromElement('#performance-data [data-day4]'),
                    getValueFromElement('#performance-data [data-day5]'),
                    getValueFromElement('#performance-data [data-day6]'),
                    getValueFromElement('#performance-data [data-day7]')
                ],
                backgroundColor: 'rgba(70, 130, 180, 0.2)',
                borderColor: '#4682B4',  
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.querySelector('.sidebar').style.display = 'block';
        document.querySelector('.close-button').style.display = 'none';
    } else {
        document.querySelector('.sidebar').style.display = 'none';
        document.querySelector('.close-button').style.display = 'none';
    }
});