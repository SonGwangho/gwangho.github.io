function click_convert() {
  const fileUpload = document.getElementById("input_excel_upload");
  const file = fileUpload.files[0];

  excel_to_csv(file);
}

function excel_to_csv(file, sheet = undefined, isDownload = false) {
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      let sheet_name = sheet;
      if (!sheet) sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheet_name];
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      MyStorage.save_session(
        "excel_json_data",
        XLSX.utils.sheet_to_json(worksheet)
      );
      if (isDownload) download_csv(csv, file.name);
    };
    reader.readAsArrayBuffer(file);
  }
}

function json_to_csv(json, isDownload = false) {
  if (json) {
    try {
      const jsonData = JSON.parse(json);
      const worksheet = XLSX.utils.json_to_sheet(jsonData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      if (isDownload) download_csv(csv);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  } else {
    alert("Please paste your JSON data first.");
  }
}

function download_csv(csv, name = undefined) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  if (name) {
    const timestamp = MyDate.get_now("yyyyMMdd_HHmmss");
    name = `download_${timestamp}.csv`;
  } else {
    name = `${name}_${timestamp}.csv`;
  }
  link.download = name;
  link.click();
}
