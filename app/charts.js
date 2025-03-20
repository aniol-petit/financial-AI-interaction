document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get("client");

    fetch("data/clients.json")
        .then(response => response.json())
        .then(data => {
            const client = data.clients.find(c => c.id == clientId);
            if (!client) {
                console.error("❌ Client not found.");
                return;
            }

            // ✅ Update client profile information
            document.getElementById("client-name").textContent = client.name;
            document.getElementById("client-age").textContent = client.age;
            document.getElementById("account-type").textContent = client.account_type;
            document.getElementById("client-bio").textContent = client.bio;
            document.getElementById("risk-level").textContent = client.risk;
            document.getElementById("investment-goals").textContent = client.goals;

            // ✅ Load profile image
            const imgElement = document.getElementById("client-img");
            const imagePath = `assets/${client.image}`;

            fetch(imagePath)
                .then(response => {
                    if (!response.ok) throw new Error("Image not found");
                    imgElement.src = imagePath;
                })
                .catch(() => imgElement.src = "assets/default-profile.png");

            // ✅ Render Portfolio Chart (Pie Chart)
            loadPortfolioChart(client.portfolio);

            // ✅ Render Market Trends Chart (Line Chart)
            loadMarketTrendsChart(client.market_trends);

            // ✅ Fetch & Display Market Insights
            fetchMarketInsights(client.portfolio.asset_classes);
        })
        .catch(error => console.error("❌ Error loading client data:", error));
});

// ✅ Function to Render Portfolio Breakdown Chart
function loadPortfolioChart(portfolio) {
    const ctx = document.getElementById("portfolioChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: portfolio.asset_classes,
            datasets: [{
                data: portfolio.allocation,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]
            }]
        }
    });
}

// ✅ Function to Render Market Trends Chart
function loadMarketTrendsChart(market_trends) {
    const ctx = document.getElementById("marketChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: market_trends.dates,
            datasets: [{
                label: "Market Trend",
                data: market_trends.values,
                borderColor: "#007bff",
                fill: false
            }]
        }
    });
}

// ✅ Fetch Market Insights using API
function fetchMarketInsights(sectors) {
    console.log("📡 Fetching market insights for:", sectors);

    fetch("http://localhost:3000/proxy-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectors: sectors })
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ LLM Response Parsed:", data.tool_calls);

        if (data.tool_calls) {
            const bestSectorCall = data.tool_calls.find(call => call.args.list_type === "Winner By Market");
            const worstSectorCall = data.tool_calls.find(call => call.args.list_type === "Loser By Market");

            let bestSector = bestSectorCall ? bestSectorCall.args.market : "N/A";
            let worstSector = worstSectorCall ? worstSectorCall.args.market : "N/A";

            // Prevent the same sector from appearing as both best and worst
            if (bestSector === worstSector) {
                worstSector = "N/A";
            }

            // ✅ Update UI with insights and icons
            document.getElementById("market-insights").innerHTML = `
                <img src="assets/uptrend.png" width="20"> <strong>Best:</strong> ${bestSector},
                <img src="assets/downtrend.png" width="20"> <strong>Worst:</strong> ${worstSector}
            `;
        } else {
            document.getElementById("market-insights").textContent = "No insights available.";
        }
    })
    .catch(error => {
        console.error("❌ Error fetching market insights:", error);
        document.getElementById("market-insights").textContent = "Failed to fetch market insights.";
    });
}

