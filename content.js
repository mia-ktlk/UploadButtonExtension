function submitConversation(text, part, filename) {
    const textarea = document.querySelector("textarea[tabindex='0']");
    const enterKeyEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      keyCode: 13,
    });
    textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
    textarea.dispatchEvent(enterKeyEvent);
  }
  
  let chatgptReady = false;
  
  async function checkChatGPTReady() {
    while (!chatgptReady) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
    }
  }
  
  async function executeCode() {
    const numChunks = 5; // Adjust this according to your requirements
  
    for (let i = 0; i < numChunks; i++) {
      const text = `Chunk ${i + 1}`;
      const part = i + 1;
      const filename = 'example.txt';
  
      await submitConversation(text, part, filename);
  
      const progress = ((i + 1) / numChunks
  