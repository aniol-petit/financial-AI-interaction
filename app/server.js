const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const SIX_API_URL = "https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io";

app.post("/proxy-llm", async (req, res) => {
    try {
        const sectors = req.body.sectors || ["Stocks", "Bonds", "Real Estate", "Crypto"];
        const query = `Based on current market trends, which of the following sectors: ${sectors.join(", ")} is performing the best and which is performing the worst?`;

        const apiUrl = `${SIX_API_URL}/llm?query=${encodeURIComponent(query)}`;

        console.log("📡 Sending LLM API Request:", apiUrl);

        const response = await axios.post(apiUrl, {}, { headers: { "accept": "application/json" } });

        // 🔍 Log the full response from the API
        console.log("📡 Full LLM API Response:", JSON.stringify(response.data, null, 2));

        res.json(response.data);
    } catch (error) {
        console.error("❌ Error fetching data from LLM API:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch market insights" });
    }
});

app.listen(3000, () => console.log("✅ Proxy running on http://localhost:3000"));
