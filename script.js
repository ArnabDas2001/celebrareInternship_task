let zIndexCounter = 1;
let stateStack = [];
let currentStateIndex = -1;


// for saving the cureent state
function saveState() {
  const container = document.getElementById("container").innerHTML;
  stateStack = stateStack.slice(0, currentStateIndex + 1);
  stateStack.push(container);
  currentStateIndex = stateStack.length - 1;
}


// for undo
function undo() {
  if (currentStateIndex > 0) {
    currentStateIndex--;
    updateContainerState();
  }
}


// for redo
function redo() {
  if (currentStateIndex < stateStack.length - 1) {
    currentStateIndex++;
    updateContainerState();
  }
}

// updating the state
function updateContainerState() {
  const container = document.getElementById("container");
  container.innerHTML = stateStack[currentStateIndex];
  document.querySelectorAll(".text-box").forEach((element) => {
    makeTextDraggable(element);
  });
}


// adding text container
    function addText() {
      const text = document.getElementById("addText").value;
      if (!text) return;

      const textElement = document.createElement("div");
      textElement.classList.add("text-box");
      textElement.innerHTML = text;
      textElement.style.zIndex = zIndexCounter++;
      textElement.setAttribute('contenteditable', 'true');
      document.getElementById("container").appendChild(textElement);

      makeTextDraggable(textElement);

      saveState();
    }

    function makeTextDraggable(element) {
      let offsetX, offsetY, isDragging = false;

      element.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
      });

      document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          const x = e.clientX - offsetX;
          const y = e.clientY - offsetY;

          element.style.left = `${x}px`;
          element.style.top = `${y}px`;
        }
      });

      document.addEventListener("mouseup", () => {
        if(isDragging) {
        isDragging = false;

        saveState();
        }
      });
    }


    document.getElementById("fontSelector").addEventListener("change", (e) => {
      document.querySelectorAll(".text-box[selected]").forEach((element) => {
        element.style.fontFamily = e.target.value;
      });
      saveState();
    });

    document.getElementById("fontSizeSelector").addEventListener("input", (e) => {
      document.querySelectorAll(".text-box[selected]").forEach((element) => {
        element.style.fontSize = `${e.target.value}px`;
      });
      saveState();
    });

    document.getElementById("fontColorSelector").addEventListener("input", (e) => {
      const selectedText = document.querySelector(".text-box[selected]");
      if (selectedText) {
        selectedText.style.color = e.target.value;
      }
    });

    document.getElementById("container").addEventListener("click", (e) => {
      document.querySelectorAll(".text-box").forEach((element) => {
        element.removeAttribute("selected");
      });

      const selectedText = e.target.closest(".text-box");
      if (selectedText) {
        selectedText.setAttribute("selected", true);
        document.getElementById("fontColorSelector").value = selectedText.style.color || "#000000";
      }
    });