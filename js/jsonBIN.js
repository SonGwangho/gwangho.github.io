// class JsonBin {
//   static API_KEY =
//     "$2a$10$f8kgZZ3N6OqzpsgvVNBZweNPu6ixzzfw2mFBeMC/fSWlRbLWNZYRK";
//   static BIN_ID = "668b8b70e41b4d34e40ebaeb";

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
    this.displayNotes();
  }

//   static async deleteNote(index) {
//     const notesData = await this.getData();
//     const notes = notesData.record.memos || [];
//     notes.splice(index, 1);
//     await this.saveData({ memos: notes });
//     this.displayNotes();
//   }

//   static async saveData(data) {
//     return fetch(`https://api.jsonbin.io/v3/b/${this.BIN_ID}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Master-Key": this.API_KEY,
//         "X-Bin-Versioning": "false",
//       },
//       body: JSON.stringify({ record: data }),
//     })
//       .then((response) => response.json())
//       .catch((error) => console.error("Error:", error));
//   }

//   static async getData() {
//     return fetch(`https://api.jsonbin.io/v3/b/${this.BIN_ID}/latest`, {
//       headers: {
//         "X-Master-Key": this.API_KEY,
//       },
//     })
//       .then((response) => response.json())
//       .then((json) => json.record)
//       .catch((error) => {
//         console.error("Error:", error);
//         return { memos: [] };
//       });
//   }
// }
