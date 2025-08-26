const memoInput = document.getElementById("memoInput");
const saveBtn = document.getElementById("saveBtn");
const memoList = document.getElementById("memoList");

let editIndex = null; // 수정 중인 메모 인덱스 저장

// 저장된 메모 불러오기
window.onload = function () {
  const savedMemos = JSON.parse(localStorage.getItem("memos")) || [];
  savedMemos.forEach(memo => addMemo(memo.text, memo.time));
};

// 메모 추가 함수
function addMemo(text, time) {
  const div = document.createElement("div");
  div.className = "memo";

  const memoText = document.createElement("p");
  memoText.innerText = text;
  div.appendChild(memoText);

  const memoTime = document.createElement("span");
  memoTime.innerText = time;
  div.appendChild(memoTime);

  // 수정 버튼
  const editBtn = document.createElement("button");
  editBtn.innerText = "수정";
  editBtn.className = "editBtn";
  editBtn.onclick = function () {
    memoInput.value = text; // 입력창에 기존 내용 표시
    editIndex = getMemoIndex(text, time); // 수정할 인덱스 저장
  };
  div.appendChild(editBtn);

  // 삭제 버튼
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "X";
  deleteBtn.className = "deleteBtn";
  deleteBtn.onclick = function () {
    div.remove();
    removeMemoFromStorage(text, time);
  };
  div.appendChild(deleteBtn);

  memoList.appendChild(div);
}

// 버튼 클릭 시 메모 저장 or 수정
saveBtn.addEventListener("click", () => {
  const text = memoInput.value.trim();
  if (!text) return;

  const savedMemos = JSON.parse(localStorage.getItem("memos")) || [];

  if (editIndex !== null) {
    // 수정 모드
    savedMemos[editIndex].text = text;
    localStorage.setItem("memos", JSON.stringify(savedMemos));
    refreshMemos();
    editIndex = null; // 수정 모드 해제
  } else {
    // 새 메모 추가
    const now = new Date();
    const time = now.toLocaleString();

    addMemo(text, time);
    savedMemos.push({ text, time });
    localStorage.setItem("memos", JSON.stringify(savedMemos));
  }

  memoInput.value = "";
});

// localStorage에서 메모 삭제
function removeMemoFromStorage(text, time) {
  const savedMemos = JSON.parse(localStorage.getItem("memos")) || [];
  const filteredMemos = savedMemos.filter(memo => !(memo.text === text && memo.time === time));
  localStorage.setItem("memos", JSON.stringify(filteredMemos));
}

// 메모 인덱스 찾기
function getMemoIndex(text, time) {
  const savedMemos = JSON.parse(localStorage.getItem("memos")) || [];
  return savedMemos.findIndex(memo => memo.text === text && memo.time === time);
}

// 화면 새로고침 없이 메모 리스트 갱신
function refreshMemos() {
  memoList.innerHTML = "";
  const savedMemos = JSON.parse(localStorage.getItem("memos")) || [];
  savedMemos.forEach(memo => addMemo(memo.text, memo.time));
}
