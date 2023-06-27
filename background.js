chrome.action.onClicked.addListener((tab) => {



  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => { // Create the button

      const button = document.createElement('button');
      button.id = "submit-file"
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



      // Find the target element
      const targetElement = document.querySelector('#prompt-textarea');
      const ev2 = new Event('input', { bubbles: true });
      const button2 = document.querySelector("button.absolute");

      if (document.querySelector("#submit-file") == null) {
        // Append the progress bar to the progress element
        progress.appendChild(progressBar);
        // Insert the button and progress element before the target element
        targetElement.parentNode.insertBefore(progress, targetElement);
        targetElement.parentNode.insertBefore(button, targetElement);
      }
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
              const chunks = chunkText(fileContent, 6899);
              const numChunks = chunks.length;

              var beforeChunkMsg = `I am about to submit a large split into ${numChunks} chunks. Do not become alarmed if the data appears to be cutoff. The rest of that entry will be provided in the following chunk. For example, if the entry should say "United States of America" but only says "Unit" you can expect the next chunk to start with "ed States of America". Please keep your responses to a minimum until the entire set of file chunks has been sent. Unless requested in a future prompt, do not generate a response that repeats the data back to the user or attempts to fill in gaps with new data.`;
              var afterChunkMsg = `Please ensure you have read the above ${numChunks} chunks of CSV data and are considering it as one complete file. Remember that some data may appear to be cutoff, but actually has the remainder of its data in the chunk directly after it. More specifically, these cutoffs should only appear at the beginning and ending of chunks, so look to combine the last line of a chunk with the first line of the next chunk. For example, the last line of chunk 1 may combine with the first line of chunk 2 to complete the CSV entry.`;

              await submitMessage(beforeChunkMsg);
              for (let i = 0; i < numChunks; i++) {
                const chunk = chunks[i];
                const part = i + 1;
                await submitConversation(chunk, part, file.name);

                progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
              }
              await submitMessage(afterChunkMsg);

              progress.style.backgroundColor = 'blue';
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

      async function submitMessage(msg) {
        targetElement.focus();
        targetElement.value = msg;
        await targetElement.dispatchEvent(ev2);
        button2.click();

        // Check if ChatGPT is ready
        let chatgptReady = false;
        while (!chatgptReady) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          chatgptReady = !document.querySelector('.text-2xl > span:not(.invisible)');
        }
      }

      // Function to submit a conversation
      async function submitConversation(text, part, filename) {
        targetElement.focus();

        targetElement.value = `${filename} Data (Part ${part}):\n---------------\n${text}`;

        await targetElement.dispatchEvent(ev2);
        button2.click();

        //await Input.dispatchKeyEvent({ type: 'char', text: "\r" })
        //await textarea.dispatchEvent(new Event('keydown', {bubbles: true, key: 'Enter', code: 'Enter', keyCode: 13}));
        // Check if ChatGPT is ready
        let chatgptReady = false;
        while (!chatgptReady) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          chatgptReady = !document.querySelector('.text-2xl > span:not(.invisible)');
        }

      }
    },
  });
});

