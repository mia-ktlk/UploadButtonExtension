chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript({
      code: // Create the button
      const button = document.createElement('button');
      button.textContent = 'Submit File';
      button.style.backgroundColor = 'green';
      button.style.color = 'white';
      button.style.padding = '5px';
      button.style.border = 'none';
      button.style.borderRadius = '5px';
      button.style.margin = '5px';
      
      // Create the progress element
      const progress = document.createElement('progress');
      progress.style.width = '99%';
      progress.style.height = '5px';
      progress.style.backgroundColor = 'grey';
      
      // Create the progress bar inside the progress element
      const progressBar = document.createElement('div');
      progressBar.style.width = '0%';
      progressBar.style.height = '100%';
      progressBar.style.backgroundColor = 'blue';
      
      // Append the progress bar to the progress element
      progress.appendChild(progressBar);
      
      // Find the target element
      const targetElement = document.querySelector('.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4');
      
      // Insert the button and progress element before the target element
      targetElement.parentNode.insertBefore(progress, targetElement);
      targetElement.parentNode.insertBefore(button, targetElement);
      
      // Add click event listener to the button
      button.addEventListener('click', async () => {
        // Create the file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt, .js, .py, .html, .css, .json, .csv';
      
        // Function to handle file selection
        fileInput.addEventListener('change', async (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
              const fileContent = e.target.result;
              const chunks = chunkText(fileContent, 15000);
              const numChunks = chunks.length;
      
              for (let i = 0; i < numChunks; i++) {
                const chunk = chunks[i];
                const part = i + 1;
      
                await submitConversation(chunk, part, file.name);
                progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
              }
      
              progressBar.style.backgroundColor = 'blue';
            };
      
            reader.readAsText(file);
          }
        });
      
        // Trigger the file input dialog
        fileInput.click();
      });
      
      // Function to split text into chunks
      function chunkText(text, chunkSize) {
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
          chunks.push(text.slice(i, i + chunkSize));
        }
        return chunks;
      }
      
      // Function to submit a conversation
      async function submitConversation(text, part, filename) {
        const textarea = document.querySelector("textarea[tabindex='0']");
        const enterKeyEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 13,
        });
        textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
        textarea.dispatchEvent(enterKeyEvent);
      
        // Check if ChatGPT is ready
        let chatgptReady = false;
        while (!chatgptReady) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          chatgptReady = !document.querySelector('.text-2xl > span:not(.invisible)');
        }
      }
    });
  });
  