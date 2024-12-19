// Check if user is logged in
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
} else {
    // Display the logged-in user's name
    const userName = localStorage.getItem("userName");
    document.getElementById("userName").textContent = userName || "Guest";
}

// Initialize Medications and Appointments from localStorage
let medications = JSON.parse(localStorage.getItem("medications")) || [];
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

// Save Medications to localStorage
function saveMedications() {
    localStorage.setItem("medications", JSON.stringify(medications));
}

// Save Appointments to localStorage
function saveAppointments() {
    localStorage.setItem("appointments", JSON.stringify(appointments));
}

// Add Medication
function addMedication() {
    const name = document.getElementById("medicationName").value.trim();
    const dosage = document.getElementById("dosage").value.trim();
    const schedule = document.getElementById("schedule").value;

    if (name && dosage && schedule) {
        const med = { name, dosage, schedule, status: "Pending" };
        medications.push(med);
        saveMedications(); // Save to localStorage
        updateMedicationList();
        clearMedicationForm();
    } else {
        alert("Please fill in all fields before adding a medication.");
    }
}

// Update Medication List
function updateMedicationList() {
    const list = document.getElementById("medicationList");
    list.innerHTML = ""; // Clear the list before updating
    medications.forEach((med, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${med.name} - ${med.dosage} at ${med.schedule} (${med.status})
            <button class="btn btn-primary" onclick="markMedicationDone(${index})">Mark Done</button>
            <button class="btn btn-delete" onclick="deleteMedication(${index})">Delete</button>`;
        list.appendChild(li);
    });
}

// Clear Medication Form
function clearMedicationForm() {
    document.getElementById("medicationName").value = "";
    document.getElementById("dosage").value = "";
    document.getElementById("schedule").value = "";
}

// Mark Medication Done
function markMedicationDone(index) {
    medications[index].status = "Done";
    saveMedications(); // Save changes to localStorage
    updateMedicationList();
}

// Delete Medication
function deleteMedication(index) {
    medications.splice(index, 1);
    saveMedications(); // Save changes to localStorage
    updateMedicationList();
}

// Add Appointment
function addAppointment() {
    const name = document.getElementById("appointmentName").value.trim();
    const date = document.getElementById("appointmentDate").value;

    if (name && date) {
        const app = { name, date, status: "Pending" };
        appointments.push(app);
        saveAppointments(); // Save to localStorage
        updateAppointmentList();
        clearAppointmentForm();
    } else {
        alert("Please fill in all fields before adding an appointment.");
    }
}

// Update Appointment List
function updateAppointmentList() {
    const list = document.getElementById("appointmentList");
    list.innerHTML = ""; // Clear the list before updating
    appointments.forEach((app, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${app.name} on ${app.date} (${app.status})
            <button class="btn btn-primary" onclick="markAppointmentDone(${index})">Mark Done</button>
            <button class="btn btn-edit" onclick="rescheduleAppointment(${index})">Reschedule</button>
            <button class="btn btn-delete" onclick="cancelAppointment(${index})">Cancel</button>`;
        list.appendChild(li);
    });
}

// Clear Appointment Form
function clearAppointmentForm() {
    document.getElementById("appointmentName").value = "";
    document.getElementById("appointmentDate").value = "";
}

// Mark Appointment Done
function markAppointmentDone(index) {
    appointments[index].status = "Done";
    saveAppointments(); // Save changes to localStorage
    updateAppointmentList();
}

// Reschedule Appointment
function rescheduleAppointment(index) {
    const newDate = prompt("Enter new date (YYYY-MM-DD):", appointments[index].date);
    if (newDate) {
        appointments[index].date = newDate;
        saveAppointments(); // Save changes to localStorage
        updateAppointmentList();
    }
}

// Cancel Appointment
function cancelAppointment(index) {
    appointments.splice(index, 1);
    saveAppointments(); // Save changes to localStorage
    updateAppointmentList();
}

// Initialize Lists on Page Load
document.addEventListener("DOMContentLoaded", () => {
    updateMedicationList();
    updateAppointmentList();
});


 // Fetch Exercises
async function fetchExercises() {
    try {
        const response = await fetch("data.json"); 
        if (!response.ok) {
            throw new Error("Failed to fetch exercise data.");
        }
        const data = await response.json();
        if (data.exerciseSuggestions) {
            populateExerciseSuggestions(data.exerciseSuggestions);
        }
    } catch (error) {
        console.error("Error fetching exercise suggestions:", error);
        alert("Failed to load exercise suggestions. Please try again later.");
    }
}

// Populate Exercise Suggestions with Videos and Images
function populateExerciseSuggestions(exercises) {
    const list = document.getElementById("exerciseList");
    list.innerHTML = ""; // Clear existing content

    exercises.forEach((exercise) => {
        try {
            // Use the image key from the JSON or generate a thumbnail for YouTube videos
            const imageURL = exercise.image
                ? exercise.image
                : exercise.videoLink
                ? `https://img.youtube.com/vi/${new URL(exercise.videoLink).searchParams.get("v")}/hqdefault.jpg`
                : "https://via.placeholder.com/200?text=No+Image"; // Default fallback image

            // Create list item
            const li = document.createElement("li");
            li.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <img src="${imageURL}" alt="${exercise.name} image" style="width: 200px; height: auto; display: block; margin-bottom: 10px;">
                    <p><strong>${exercise.name}</strong> - ${exercise.duration} (${exercise.type})</p>
                    ${
                        exercise.videoLink
                            ? `<a href="${exercise.videoLink}" target="_blank" style="color: blue; text-decoration: underline;">Watch Video</a>`
                            : `<p style="color: red;">Video not available</p>`
                    }
                </div>
            `;
            list.appendChild(li);
        } catch (error) {
            console.error(`Error processing exercise: ${exercise.name}`, error);
        }
    });
}

// Hide Exercises
function hideExercises() {
    const list = document.getElementById("exerciseList");
    list.innerHTML = ""; // Clear the list
}

// Attach event listeners for exercise buttons
document.getElementById("fetchExercisesBtn").addEventListener("click", fetchExercises);
document.getElementById("hideExercisesBtn").addEventListener("click", hideExercises);

const activeReminders = new Map(); // To track active reminders by ID

// Play reminder sound for a specific reminder ID
function playReminderSound(reminderId) {
    if (activeReminders.has(reminderId)) return; // Avoid duplicate reminders

    const sound = document.getElementById("reminderSound");

    // Start playing sound every 5 seconds
    const intervalId = setInterval(() => {
        sound.currentTime = 0; // Reset to the start of the audio
        sound.play().catch((error) => {
            console.error("Failed to play sound:", error);
        });
    }, 5000);

    // Store the interval ID in the active reminders map
    activeReminders.set(reminderId, intervalId);
}

// Stop reminder sound for a specific reminder ID
function stopReminder(reminderId) {
    if (activeReminders.has(reminderId)) {
        clearInterval(activeReminders.get(reminderId)); // Clear the interval
        activeReminders.delete(reminderId); // Remove from active reminders map
    }
}

// Execute reminders to play sound and alert for pending medications or appointments
function executeReminders() {
    setInterval(() => {
        const currentTime = new Date().toTimeString().slice(0, 5); // HH:MM format
        const todayDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

        // Check medications
        medications.forEach((med, index) => {
            const reminderId = `medication-${index}`;
            if (med.schedule === currentTime && med.status === "Pending" && !activeReminders.has(reminderId)) {
                playReminderSound(reminderId);
                alert(`Reminder: It's time to take your medication - ${med.name} (${med.dosage}).`);
            }
        });

        // Check appointments
        appointments.forEach((app, index) => {
            const reminderId = `appointment-${index}`;
            if (app.date === todayDate && app.time === currentTime && app.status === "Pending" && !activeReminders.has(reminderId)) {
                playReminderSound(reminderId);
                alert(`Reminder: You have an appointment - ${app.name} at ${app.time}.`);
            }
        });
    }, 5000); // Check every 5 seconds
}

// Stop reminders when marked done or deleted
function stopReminderForActivity(type, index) {
    const reminderId = `${type}-${index}`;
    stopReminder(reminderId); // Stop the reminder sound
}

// Mark Medication Done
function markMedicationDone(index) {
    medications[index].status = "Done";
    updateMedicationList();
    stopReminderForActivity("medication", index);
}

// Delete Medication
function deleteMedication(index) {
    medications.splice(index, 1);
    updateMedicationList();
    stopReminderForActivity("medication", index);
}

// Mark Appointment Done
function markAppointmentDone(index) {
    appointments[index].status = "Done";
    updateAppointmentList();
    stopReminderForActivity("appointment", index);
}

// Cancel Appointment
function cancelAppointment(index) {
    appointments.splice(index, 1);
    updateAppointmentList();
    stopReminderForActivity("appointment", index);
}

// Initialize reminders execution
executeReminders();

