function roll(cnt = 3) {
  const totalmoney = document
    .getElementById("dice_money")
    .querySelector("span");
  const betMoney = document.getElementById("bet_money").querySelector("input");

  const values = [0, 0, 0];
  let idx = 0;
  Array.from(document.getElementsByClassName("dice")).map((dice) =>
    dice.rollDice((value) => {
      values[idx++] = value;
      console.log("구름" + values.join(" "));
      if (!values.includes(0)) {
        console.log("다구름");
        values.sort();

        switch (values) {
          case [1, 2, 3]:
            // 히후미 2배 뺏김
            MyToast.showToast("히후미... 두배 뺏겨요.");
            totalmoney.innerText =
              parseInt(totalmoney.innerText) - parseInt(betMoney.value) * 2;
            break;
          case [1, 1, 1]:
            // 핀조로 5배
            MyToast.showToast("핀조로! 5배!!!!!");
            totalmoney.innerText =
              parseInt(totalmoney.innerText) + parseInt(betMoney.value) * 5;
            break;
          case [2, 2, 2]:
          case [3, 3, 3]:
          case [4, 4, 4]:
          case [5, 5, 5]:
          case [6, 6, 6]:
            // 아라시 3배
            MyToast.showToast("아라시! 3배!!!");
            totalmoney.innerText =
              parseInt(totalmoney.innerText) + parseInt(betMoney.value) * 3;
            break;
          case [4, 5, 6]:
            // 시고로 2배
            MyToast.showToast("시고로! 2배!!");
            totalmoney.innerText =
              parseInt(totalmoney.innerText) + parseInt(betMoney.value) * 2;
            break;
          default:
            if (hasEye(values)) {
              // 눈 있음
              const eye = getEye(values);
              MyToast.showToast("당신의 눈: " + eye.toString());
              if (parseInt(eye) == 3) {
                cnt--;
                MyToast.showToast("비겼음 다시굴립니다.");
                if (cnt > 0) setTimeout(() => roll(cnt), 3000);
                else {
                  MyToast.showToast("당신의 패배...");
                  cnt = 3;
                  totalmoney.innerText =
                    parseInt(totalmoney.innerText) - parseInt(betMoney.value);
                }
              } else if (parseInt(eye) > 3) {
                MyToast.showToast("당신의 승리!");
                totalmoney.innerText =
                  parseInt(totalmoney.innerText) + parseInt(betMoney.value);
              } else {
                MyToast.showToast("당신의 패배...");
                totalmoney.innerText =
                  parseInt(totalmoney.innerText) - parseInt(betMoney.value);
              }
            } else {
              // 눈 없음 다시 돌리기
              MyToast.showToast("눈 없음 다시굴립니다.");
              cnt--;
              if (cnt > 0) setTimeout(() => roll(cnt), 3000);
              else {
                MyToast.showToast("당신의 패배...");
                cnt = 3;
                totalmoney.innerText =
                  parseInt(totalmoney.innerText) - parseInt(betMoney.value);
              }
            }
        }
      }
    })
  );
}

function hasEye(arr) {
  return arr[0] == arr[1] || arr[1] == arr[2] || arr[2] == arr[0];
}

function getEye(arr) {
  if (arr[0] == arr[1]) {
    return arr[2];
  } else if (arr[1] == arr[2]) {
    return arr[0];
  }
  return arr[1];
}
