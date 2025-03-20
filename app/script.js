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

// ✅ Open Edit Client Form (Only Shows When Clicking "Edit Client")
function editClient(clientId) {
    let clients = JSON.parse(localStorage.getItem("clients"));
    let client = clients.find(c => c.id === clientId);

    if (client) {
        document.getElementById("edit-name").value = client.name;
        document.getElementById("edit-age").value = client.age;
        document.getElementById("edit-risk").value = client.risk;
        document.getElementById("edit-goals").value = client.goals;

        document.getElementById("edit-client-modal").classList.remove("hidden");
        document.getElementById("edit-client-modal").setAttribute("data-client-id", clientId);
    }
}

// ✅ Save Client Changes & Update Local Storage
function saveClientChanges() {
    let clientId = document.getElementById("edit-client-modal").getAttribute("data-client-id");
    let clients = JSON.parse(localStorage.getItem("clients"));

    let clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex !== -1) {
        clients[clientIndex].name = document.getElementById("edit-name").value;
        clients[clientIndex].age = document.getElementById("edit-age").value;
        clients[clientIndex].risk = document.getElementById("edit-risk").value;
        clients[clientIndex].goals = document.getElementById("edit-goals").value;

        localStorage.setItem("clients", JSON.stringify(clients)); // Save updates
        loadClients(); // Refresh list with updated names
        closeEditModal();
    }
}

// ✅ Close Edit Client Form
function closeEditModal() {
    document.getElementById("edit-client-modal").classList.add("hidden");
}

// ✅ Delete Client (Removes from Local Storage & UI)
function deleteClient(clientId) {
    let confirmation = confirm("Are you sure you want to delete this client?");
    if (confirmation) {
        let clients = JSON.parse(localStorage.getItem("clients"));
        clients = clients.filter(client => client.id !== clientId);
        localStorage.setItem("clients", JSON.stringify(clients));
        loadClients();
    }
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

// ✅ Click Outside to Close Menus
document.addEventListener("click", () => {
    document.querySelectorAll('.menu-dropdown').forEach(menu => menu.style.display = "none");
});
