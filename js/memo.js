async function displayNotes() {
  Modal.startLoading();
  const notesData = await Gist.getData();
  const notes = notesData.memos || [];
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

      deleteButton.onclick = () => deleteNote(notesData, index);

      noteDiv.appendChild(noteText);
      noteDiv.appendChild(deleteButton);
      savedNotesDiv.appendChild(noteDiv);
    });
  }

  Modal.stopLoading();
}

async function deleteNote(data, index) {
  const notes = data.memos || [];
  notes.splice(index, 1);
  await Gist.saveData({ memos: notes });
  displayNotes();
}

async function saveNote() {
  const noteContent = document.getElementById("note-content").value;
  if (noteContent.trim() === "") {
    alert("메모를 입력하세요.");
    return;
  }
  const notesData = await Gist.getData();
  const notes = notesData.record.memos || [];
  notes.push({ memo: noteContent });
  await Gist.saveData({ memos: notes });
  document.getElementById("note-content").value = "";
  displayNotes();
}
