// DSA Practical Library
// This file controls the page: selecting practicals, switching tabs and copying code.

const programs = window.PROGRAMS;
const topics = ["All topics", ...new Set(programs.map((program) => program.topic))];

let selectedProgramIndex = 0;
let activeTopic = "All topics";
let searchText = "";

// Find the page elements once so we can update them when the user interacts.
const elements = {
  topicFilters: document.getElementById("topicFilters"),
  searchInput: document.getElementById("searchInput"),
  visibleCount: document.getElementById("visibleCount"),
  selectedTitle: document.getElementById("selectedTitle"),
  selectedSubtitle: document.getElementById("selectedSubtitle"),
  selectedLevel: document.getElementById("selectedLevel"),
  fileName: document.getElementById("fileName"),
  codeBlock: document.getElementById("codeBlock"),
  lineCount: document.getElementById("lineCount"),
  ideaText: document.getElementById("ideaText"),
  stepsList: document.getElementById("stepsList"),
  complexityText: document.getElementById("complexityText"),
  rememberText: document.getElementById("rememberText"),
  positionLabel: document.getElementById("positionLabel"),
  previousButton: document.getElementById("previousButton"),
  nextButton: document.getElementById("nextButton"),
  copyButton: document.getElementById("copyButton"),
  codeTab: document.getElementById("codeTab"),
  guideTab: document.getElementById("guideTab"),
  codePanel: document.getElementById("codePanel"),
  guidePanel: document.getElementById("guidePanel"),
  themeButton: document.getElementById("themeButton"),
  themeIcon: document.getElementById("themeIcon"),
  themeLabel: document.getElementById("themeLabel")
};

// Return only practicals that match both the topic and search query.
function getVisiblePrograms() {
  return programs
    .map((program, index) => ({ program, index }))
    .filter(({ program }) => {
      const matchesTopic =
        activeTopic === "All topics" || program.topic === activeTopic;

      const searchableText =
        `${program.title} ${program.subtitle} ${program.topic}`.toLowerCase();

      const matchesSearch = searchableText.includes(searchText);
      return matchesTopic && matchesSearch;
    });
}

// Draw the topic filter buttons in the left sidebar.
function renderTopicFilters() {
  elements.topicFilters.innerHTML = "";

  topics.forEach((topic) => {
    const count =
      topic === "All topics"
        ? programs.length
        : programs.filter((program) => program.topic === topic).length;

    const button = document.createElement("button");
    button.type = "button";
    button.className =
      topic === activeTopic ? "topic-button active" : "topic-button";

    button.innerHTML = `<span>${topic}</span><small>${String(count).padStart(2, "0")}</small>`;

    button.addEventListener("click", () => {
      activeTopic = topic;
      renderTopicFilters();
      updateVisibleCount();
      chooseFirstVisibleProgram();
    });

    elements.topicFilters.appendChild(button);
  });
}

// Keep the sidebar count in sync with the current filter.
function updateVisibleCount() {
  elements.visibleCount.textContent = String(getVisiblePrograms().length).padStart(2, "0");
}

// Select the first result after a filter or search change.
function chooseFirstVisibleProgram() {
  const visiblePrograms = getVisiblePrograms();

  if (visiblePrograms.length === 0) {
    showEmptyState();
    return;
  }

  selectedProgramIndex = visiblePrograms[0].index;
  renderSelectedProgram();
}

// Show a friendly message when no practical matches the search.
function showEmptyState() {
  elements.selectedTitle.textContent = "No practical found";
  elements.selectedSubtitle.textContent = "Try another search or topic.";
  elements.selectedLevel.textContent = "0 RESULTS";
  elements.fileName.textContent = "No file selected";
  elements.codeBlock.textContent = "";
  elements.lineCount.textContent = "0 lines";
  elements.ideaText.textContent = "There are no matching practicals right now.";
  elements.stepsList.innerHTML = "";
  elements.complexityText.textContent = "—";
  elements.rememberText.textContent = "Clear the search field or choose another topic.";
  elements.positionLabel.textContent = "00 / 00";
  elements.previousButton.disabled = true;
  elements.nextButton.disabled = true;
}

// Update the code panel and the explanation panel for the selected practical.
function renderSelectedProgram() {
  const program = programs[selectedProgramIndex];

  elements.selectedTitle.textContent = program.title;
  elements.selectedSubtitle.textContent = program.subtitle;
  elements.selectedLevel.textContent = program.level.toUpperCase();
  elements.fileName.textContent = `assignment-${String(selectedProgramIndex + 1).padStart(2, "0")}.c`;
  elements.codeBlock.textContent = program.code.trim();
  elements.lineCount.textContent = `${program.code.trim().split("\n").length} lines`;

  elements.ideaText.textContent = program.idea;
  elements.stepsList.innerHTML = "";

  program.steps.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    elements.stepsList.appendChild(item);
  });

  elements.complexityText.textContent = program.complexity;
  elements.rememberText.textContent =
    `Topic: ${program.topic}. Focus on understanding the data structure and why each function is needed.`;

  const visiblePrograms = getVisiblePrograms();
  const visiblePosition = visiblePrograms.findIndex(
    (item) => item.index === selectedProgramIndex
  );

  elements.positionLabel.textContent =
    `${String(visiblePosition + 1).padStart(2, "0")} / ${String(visiblePrograms.length).padStart(2, "0")}`;

  elements.previousButton.disabled = visiblePosition <= 0;
  elements.nextButton.disabled = visiblePosition === visiblePrograms.length - 1;
}

// Move to the previous or next result in the current filtered list.
function moveSelection(direction) {
  const visiblePrograms = getVisiblePrograms();
  const currentPosition = visiblePrograms.findIndex(
    (item) => item.index === selectedProgramIndex
  );
  const nextItem = visiblePrograms[currentPosition + direction];

  if (nextItem) {
    selectedProgramIndex = nextItem.index;
    renderSelectedProgram();
  }
}

// Switch between the code and explanation tabs.
function showTab(tabName) {
  const showCode = tabName === "code";

  elements.codeTab.classList.toggle("active", showCode);
  elements.guideTab.classList.toggle("active", !showCode);
  elements.codeTab.setAttribute("aria-selected", String(showCode));
  elements.guideTab.setAttribute("aria-selected", String(!showCode));
  elements.codePanel.hidden = !showCode;
  elements.guidePanel.hidden = showCode;
}

// Copy the currently displayed C program.
async function copyCurrentCode() {
  const code = programs[selectedProgramIndex].code.trim();

  try {
    await navigator.clipboard.writeText(code);
    elements.copyButton.innerHTML = "<span>✓</span> Copied!";
  } catch (error) {
    // Fallback for browsers that do not allow clipboard access.
    const temporaryTextArea = document.createElement("textarea");
    temporaryTextArea.value = code;
    document.body.appendChild(temporaryTextArea);
    temporaryTextArea.select();
    document.execCommand("copy");
    temporaryTextArea.remove();
    elements.copyButton.innerHTML = "<span>✓</span> Copied!";
  }

  setTimeout(() => {
    elements.copyButton.innerHTML = "<span>▢</span> Copy code";
  }, 1600);
}

// Apply the selected colour theme and remember it on this device.
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";

  elements.themeIcon.textContent = isDark ? "☀" : "☾";
  elements.themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  localStorage.setItem("dsa-theme", theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.dataset.theme || "light";
  setTheme(currentTheme === "light" ? "dark" : "light");
}

// Connect the page controls to their actions.
elements.searchInput.addEventListener("input", (event) => {
  searchText = event.target.value.trim().toLowerCase();
  updateVisibleCount();
  chooseFirstVisibleProgram();
});

elements.previousButton.addEventListener("click", () => moveSelection(-1));
elements.nextButton.addEventListener("click", () => moveSelection(1));
elements.copyButton.addEventListener("click", copyCurrentCode);
elements.codeTab.addEventListener("click", () => showTab("code"));
elements.guideTab.addEventListener("click", () => showTab("guide"));
elements.themeButton.addEventListener("click", toggleTheme);

// Keyboard shortcut: press / to focus search, Escape to clear it.
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== elements.searchInput) {
    event.preventDefault();
    elements.searchInput.focus();
  }

  if (event.key === "Escape" && document.activeElement === elements.searchInput) {
    elements.searchInput.value = "";
    searchText = "";
    updateVisibleCount();
    chooseFirstVisibleProgram();
    elements.searchInput.blur();
  }
});

// Start with the saved theme, or use light mode for a first visit.
const savedTheme = localStorage.getItem("dsa-theme") || "light";
setTheme(savedTheme);
renderTopicFilters();
updateVisibleCount();
renderSelectedProgram();
