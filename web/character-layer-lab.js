const CHARACTER = window.OfficeRaidCharacter;
const PART_LABELS = {
  skin: "피부", face: "얼굴형", hair: "머리", eyes: "눈", eyebrows: "눈썹",
  nose: "코", mouth: "입", top: "상의", bottom: "하의", accessory: "외형 장식"
};
const PART_NAMES = {
  skin: ["웜 라이트", "내추럴", "허니", "브론즈", "딥 브라운", "다크 브라운"],
  face: ["둥근형", "부드러운형", "넓은형", "긴형", "하트형", "통통형", "각진형", "달걀형"],
  hair: Array.from({ length: 16 }, (_, index) => "헤어 " + (index + 1)),
  eyes: ["차분한 눈", "둥근 눈", "웃는 눈", "날카로운 눈", "처진 눈", "반짝이는 눈", "졸린 눈", "자신감 눈", "작은 눈", "큰 눈"],
  eyebrows: Array.from({ length: 8 }, (_, index) => "눈썹 " + (index + 1)),
  nose: Array.from({ length: 8 }, (_, index) => "코 " + (index + 1)),
  mouth: Array.from({ length: 10 }, (_, index) => "입 " + (index + 1)),
  top: Array.from({ length: 12 }, (_, index) => "상의 " + (index + 1)),
  bottom: Array.from({ length: 8 }, (_, index) => "하의 " + (index + 1)),
  accessory: CHARACTER.cosmetics
};
const look = { face: 0, skin: 1, hair: 0, eyes: 0, eyebrows: 0, nose: 0, mouth: 0, top: 0, bottom: 0, accessory: 0 };

function member() {
  return { appearance: look };
}

function renderControls() {
  const controls = document.querySelector("#controls");
  controls.innerHTML = Object.keys(CHARACTER.counts).map(key => {
    const count = CHARACTER.counts[key];
    return '<div class="part-control"><button type="button" data-key="' + key + '" data-delta="-1" aria-label="' + PART_LABELS[key] + ' 이전">‹</button><div><small>' + PART_LABELS[key] + ' ' + (look[key] + 1) + '/' + count + '</small><strong>' + PART_NAMES[key][look[key]] + '</strong></div><button type="button" data-key="' + key + '" data-delta="1" aria-label="' + PART_LABELS[key] + ' 다음">›</button></div>';
  }).join("");
  controls.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.key;
    const count = CHARACTER.counts[key];
    look[key] = (look[key] + Number(button.dataset.delta) + count) % count;
    render();
  }));
}

function render() {
  document.querySelector("#front-preview").innerHTML = CHARACTER.render(member(), "front", false);
  document.querySelector("#back-preview").innerHTML = CHARACTER.render(member(), "back", false);
  document.querySelector("#face-preview").innerHTML = CHARACTER.render(member(), "front", true);
  renderControls();
  const combinations = Object.values(CHARACTER.counts).reduce((total, count) => total * count, 1);
  document.querySelector("#combination-count").textContent = combinations.toLocaleString("ko-KR") + "가지 조합";
}

document.querySelector("#randomize").addEventListener("click", () => {
  Object.keys(CHARACTER.counts).forEach(key => { look[key] = Math.floor(Math.random() * CHARACTER.counts[key]); });
  render();
});

render();
