document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get("client");

    fetch("data/clients.json")
        .then(response => response.json())
        .then(data => {
            const client = data.clients.find(c => c.id == clientId);
            document.getElementById("client-name").textContent = client.name;
            document.getElementById("client-age").textContent = client.age;
            document.getElementById("account-type").textContent = client.account_type;
            document.getElementById("client-bio").textContent = client.bio;
            document.getElementById("risk-level").textContent = client.risk;
            document.getElementById("investment-goals").textContent = client.goals;

            const imgElement = document.getElementById("client-img");
            const imagePath = `assets/${client.image}`;

            fetch(imagePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Image not found");
                    }
                    imgElement.src = imagePath;
                })
                .catch(() => {
                    imgElement.src = "assets/default-profile.png"; // A fallback image
                });

            // Portfolio Chart
            new Chart(document.getElementById("portfolioChart"), {
                type: "pie",
                data: {
                    labels: client.portfolio.asset_classes,
                    datasets: [{
                        data: client.portfolio.allocation,
                        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"]
                    }]
                }
            });

            // Market Trends Chart
            new Chart(document.getElementById("marketChart"), {
                type: "line",
                data: {
                    labels: client.market_trends.dates,
                    datasets: [{
                        label: "Market Trend",
                        data: client.market_trends.values,
                        borderColor: "#007bff",
                        fill: false
                    }]
                }
            });
        })
        .catch(error => console.error("Error loading client data:", error));
});

