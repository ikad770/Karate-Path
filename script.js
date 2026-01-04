const quiz = [
  {
    q: "מה פירוש המילה 'קיון'?",
    options: ["תרגול לחימה", "טכניקות יסוד", "מורה", "תנועות קבועות"],
    answer: 1
  },
  {
    q: "מהי קאטה?",
    options: ["לחימה חופשית", "תנועות קבועות", "טכניקת רגל", "מבחן"],
    answer: 1
  },
  {
    q: "מה פירוש 'סנסיי'?",
    options: ["תלמיד", "מורה", "חגורה", "דוג'ו"],
    answer: 1
  }
];

let score = 0;
const quizDiv = document.getElementById("quiz");

quiz.forEach((q, i) => {
  const div = document.createElement("div");
  div.innerHTML = `<p><strong>${i + 1}. ${q.q}</strong></p>`;
  q.options.forEach((opt, j) => {
    div.innerHTML += `<label><input type="radio" name="q${i}" value="${j}"> ${opt}</label><br>`;
  });
  quizDiv.appendChild(div);
});

const btn = document.createElement("button");
btn.textContent = "בדוק תשובות";
btn.onclick = () => {
  score = 0;
  quiz.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && parseInt(selected.value) === q.answer) score++;
  });
  alert(`ניקוד: ${score}/${quiz.length}`);
};
quizDiv.appendChild(btn);
