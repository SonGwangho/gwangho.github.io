class JsonBin {
  API_KEY = "$2a$10$f8kgZZ3N6OqzpsgvVNBZweNPu6ixzzfw2mFBeMC/fSWlRbLWNZYRK";
  BIN_ID = "668b8b70e41b4d34e40ebaeb";

  static async saveNote() {
    const noteContent = document.getElementById("note-content").value;
    if (noteContent.trim() === "") {
      alert("메모를 입력하세요.");
      return;
    }
    const notesData = await this.getData();
    const notes = notesData.record.memos || [];
    notes.push({ memo: noteContent });
    await this.saveData({ memos: notes });
    document.getElementById("note-content").value = "";
    displayNotes();
  }

  static async displayNotes() {
    Modal.start_loading();
    const notesData = await this.getData();
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
    Modal.stop_loading();
  }

  static async deleteNote(index) {
    const notesData = await this.getData();
    const notes = notesData.record.memos || [];
    notes.splice(index, 1);
    await this.saveData({ memos: notes });
    displayNotes();
  }

  static async saveData(data) {
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

  static async getData() {
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
}
