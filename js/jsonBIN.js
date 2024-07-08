const API_KEY = "$2a$10$f8kgZZ3N6OqzpsgvVNBZweNPu6ixzzfw2mFBeMC/fSWlRbLWNZYRK"; // 여기에 실제 API 키를 넣어주세요
const BIN_ID = "668b8b70e41b4d34e40ebaeb"; // 여기에 실제 BIN ID를 넣어주세요

async function saveNote() {
  const noteContent = document.getElementById("note-content").value;
  if (noteContent.trim() === "") {
    alert("메모를 입력하세요.");
    return;
  }

  const notesData = await getData();
  const notes = notesData.record.memos || [];
  notes.push({ memo: noteContent });
  await saveData({ memos: notes });
  document.getElementById("note-content").value = "";
  displayNotes();
}

async function displayNotes() {
  const notesData = await getData();
  const notes = notesData.record.memos || [];
  const savedNotesDiv = document.getElementById("saved-notes");
  savedNotesDiv.innerHTML = "";

  if (notes.length === 0) {
    savedNotesDiv.innerHTML = "<p>저장된 메모가 없습니다.</p>";
  } else {
    notes.forEach((noteObj, index) => {
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("note");

      const noteText = document.createElement("div");
      noteText.style.flex = "1 0 auto";
      noteText.style.padding = "5px 10px";
      noteText.innerText = noteObj.memo;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "삭제";
      deleteButton.classList.add("delete-button");
      deleteButton.onclick = () => deleteNote(index);

      noteDiv.appendChild(noteText);
      noteDiv.appendChild(deleteButton);
      savedNotesDiv.appendChild(noteDiv);
    });
  }
}

async function deleteNote(index) {
  const notesData = await getData();
  const notes = notesData.record.memos || [];
  notes.splice(index, 1);
  await saveData({ memos: notes });
  displayNotes();
}

async function saveData(data) {
  return fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY,
      "X-Bin-Versioning": "false",
    },
    body: JSON.stringify({ record: data }),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
}

async function getData() {
  return fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: {
      "X-Master-Key": API_KEY,
    },
  })
    .then((response) => response.json())
    .then((json) => json.record)
    .catch((error) => {
      console.error("Error:", error);
      return { memos: [] };
    });
}
