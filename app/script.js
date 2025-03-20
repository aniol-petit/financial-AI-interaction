document.addEventListener("DOMContentLoaded", function () {
    loadClients();
    fetchCryptoPrices();
    setInterval(fetchCryptoPrices, 60000); // Refresh crypto prices every 60 seconds
});

// ✅ Load Clients from Local Storage or JSON
function loadClients() {
    let clients = JSON.parse(localStorage.getItem("clients"));

    if (!clients) {
        fetch("data/clients.json")
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("clients", JSON.stringify(data.clients));
                displayClients(data.clients);
            })
            .catch(error => console.error("❌ Error loading clients:", error));
    } else {
        displayClients(clients);
    }
}

// ✅ Display Clients in Sidebar
function displayClients(clients) {
    const clientList = document.getElementById("client-list");
    clientList.innerHTML = ""; // Clear previous content

    clients.forEach(client => {
        let li = document.createElement("li");
        li.classList.add("client-item");
        li.setAttribute("data-client-id", client.id);

        li.innerHTML = `
            <img src="assets/${client.image}" class="client-img"> 
            <span class="client-name" onclick="redirectToClient('${client.id}')">${client.name}</span>
            <div class="client-options">
                <span class="menu-icon" onclick="toggleMenu(event, 'menu-${client.id}')">⋮</span>
                <div class="menu-dropdown" id="menu-${client.id}">
                    <button onclick="editClient('${client.id}')">Edit Client</button>
                    <button onclick="deleteClient('${client.id}')">Delete Client</button>
                </div>
            </div>
        `;

        clientList.appendChild(li);
    });
}

// ✅ Fix: Use Updated Client Data When Redirecting
function redirectToClient(clientId) {
    let clients = JSON.parse(localStorage.getItem("clients")); // Get latest client data
    let client = clients.find(c => c.id === clientId);

    if (client) {
        localStorage.setItem("selectedClient", JSON.stringify(client)); // Save updated data
        window.location.href = "client.html"; // Redirect
    }
}

// Function to open the Edit Client modal
function editClient(clientId) {
    const editModal = document.getElementById("editClientModal");
    const clientElement = document.querySelector(`.client-item[data-client-id="${clientId}"]`);
    const clientName = clientElement.querySelector(".client-name").textContent;

    // Set the client data in the input field
    document.getElementById("editClientName").value = clientName;
    
    // Store client ID in the modal for later use
    editModal.setAttribute("data-client-id", clientId);

    // Show the modal
    editModal.style.display = "block";
}

// Function to save edited client details
function saveClientChanges() {
    const editModal = document.getElementById("editClientModal");
    const clientId = editModal.getAttribute("data-client-id");
    const newName = document.getElementById("editClientName").value;

    // Update the client name in the list
    const clientElement = document.querySelector(`.client-item[data-client-id="${clientId}"]`);
    clientElement.querySelector(".client-name").textContent = newName;

    // Close the modal
    closeEditModal();
}

// Function to close the Edit Client modal
function closeEditModal() {
    document.getElementById("editClientModal").style.display = "none";
}



// ✅ Toggle Options Menu
function toggleMenu(event, menuId) {
    event.stopPropagation();
    document.querySelectorAll('.menu-dropdown').forEach(menu => {
        if (menu.id !== menuId) menu.style.display = "none";
    });
    let menu = document.getElementById(menuId);
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Ensure the modal is closed when clicking outside of it
window.addEventListener("click", function(event) {
    const editModal = document.getElementById("editClientModal");
    if (event.target === editModal) {
        closeEditModal();
    }
});