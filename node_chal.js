const express = require("express");
const app = express();
const port = 3000;

const normalizedData = {
  things: [
    { id: 1, name: "Thing 1", category: "Category A" },
    { id: 2, name: "Thing 2", category: "Category B" },
  ],
};

function transformSourceAData(sourceAData) {
  return {
    id: sourceAData.id,
    name: sourceAData.name,
    category: sourceAData.type === "X" ? "Category A" : "Category B",
  };
}

const sourceAData = { id: 1, name: "Source A Thing", type: "X" };
const normalizedSourceAData = transformSourceAData(sourceAData);

normalizedData.things.push(normalizedSourceAData);

app.get("/things", (req, res) => {
  res.json(normalizedData.things);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
