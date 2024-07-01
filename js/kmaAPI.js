const kma_api_url =
  "https://apihub.kma.go.kr/api/typ01/url/fct_shrt_reg.php?tmfc=0&authKey=";
const request_keys = [
  "stn",
  "reg",
  "tmfc",
  "tmfc1",
  "tmfc2",
  "tmef1",
  "tmef2",
  "disp",
  "help",
];

async function getKmaJson(option = {}) {
  let url = kma_api_url;
  let option_list = [];
  for (let key in request_keys) {
    if (Object.keys(option).includes(key))
      option_list.push(key + "=" + option[keys]);
  }
  url += "&" + option_list.join("&");
  console.log(url);
  const response = await fetch(url)
    .then((result) => result.json())
    .catch((error) => {
      console.log(error);
    });
  console.log(response);
  return await response;
}
