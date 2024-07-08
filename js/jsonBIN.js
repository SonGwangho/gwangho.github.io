const API_KEY = "$2a$10$r46IyvSambW8Qwk889KeSOGHTKCuOxQMGJROZoMWQ7kfxjtT0TwRm";
const BIN_ID = "668b8b70e41b4d34e40ebaeb";

function saveData() {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const data = { name, age };

  fetch("https://api.jsonbin.io/v3/b", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((json) => {
      document.getElementById("output").textContent = JSON.stringify(
        json,
        null,
        2
      );
    })
    .catch((error) => console.error("Error:", error));
}

async function getData() {
  fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    headers: {
      "X-Master-Key": API_KEY,
    },
  })
    .then((response) => response.json())
    .then((json) => {
      document.getElementById("output").textContent = JSON.stringify(
        json.record,
        null,
        2
      );
    })
    .catch((error) => console.error("Error:", error));
}
