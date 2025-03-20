document.addEventListener("DOMContentLoaded", function () {
    fetch("data/clients.json")
        .then(response => response.json())
        .then(data => {
            const clientList = document.getElementById("client-list");
            clientList.innerHTML = "";

            data.clients.forEach(client => {
                let li = document.createElement("li");
                li.textContent = client.name;
                li.classList.add("client-item");
                li.setAttribute("data-client-id", client.id);

                li.addEventListener("click", function () {
                    window.location.href = `client.html?client=${client.id}`;
                });

                clientList.appendChild(li);
            });
        })
        .catch(error => console.error("Error loading clients:", error));
});
