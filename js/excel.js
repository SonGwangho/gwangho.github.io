function clickConvert() {
  const fileUpload = document.getElementById("input_excel_upload");
  const file = fileUpload.files[0];

  excelToCsv(file);
  const data = MyStorage.getSessionData("excel_json_data");

  document.getElementById("output").innerHTML = jsonToCsv(JSON.stringify(data));
}

function excelToCsv(file, sheet = undefined, isDownload = false) {
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      let sheet_name = sheet;
      if (!sheet) sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheet_name];
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      MyStorage.saveSession(
        "excel_json_data",
        XLSX.utils.sheet_to_json(worksheet)
      );
      if (isDownload) downloadCsv(csv, file.name);
    };
    reader.readAsArrayBuffer(file);
  }
}

function jsonToCsv(json, isDownload = false) {
  if (json) {
    try {
      const jsonData = JSON.parse(json);
      const worksheet = XLSX.utils.jsonToSheet(jsonData);
      const csv = XLSX.utils.sheetToCsv(worksheet);

      if (isDownload) downloadCsv(csv);
      return csv;
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  } else {
    alert("Please paste your JSON data first.");
  }
}

function downloadCsv(csv, name = undefined) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  if (name) {
    const timestamp = MyDate.getNow("yyyyMMdd_HHmmss");
    name = `download_${timestamp}.csv`;
  } else {
    name = `${name}_${timestamp}.csv`;
  }
  link.download = name;
  link.click();
}
