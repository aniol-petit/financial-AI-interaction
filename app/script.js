document.addEventListener("DOMContentLoaded", function () {
    fetch("data/clients.json") // Fetch clients from JSON file
        .then(response => response.json())
        .then(data => {
            const clientList = document.getElementById("client-list");
            data.clients.forEach(client => {
                let li = document.createElement("li");
                li.textContent = client.name;
                li.addEventListener("click", function () {
                    window.location.href = `client.html?client=${client.id}`;
                });
                clientList.appendChild(li);
            });
        })
        .catch(error => console.error("Error loading clients:", error));

        document.addEventListener("DOMContentLoaded", function () {
            fetch("data/clients.json")
                .then(response => response.json())
                .then(data => {
                    const clientList = document.getElementById("client-list");
                    clientList.innerHTML = ""; // Clear existing list
        
                    data.clients.forEach(client => {
                        let li = document.createElement("li");
                        li.classList.add("client-item");
                        li.setAttribute("data-client-id", client.id);
        
                        // Create image element
                        let img = document.createElement("img");
                        img.src = `assets/${client.image}`;
                        img.classList.add("client-img");
        
                        // Create text node for name
                        let name = document.createTextNode(` ${client.name}`);
        
                        // Append elements
                        li.appendChild(img);
                        li.appendChild(name);
                        clientList.appendChild(li);
        
                        // Add click event listener
                        li.addEventListener("click", function () {
                            window.location.href = `client.html?client=${client.id}`;
                        });
                    });
                })
                .catch(error => console.error("Error loading clients:", error));
        });
        
});
