

export function openFileDialog(): Promise<[File, () => void]> {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.setAttribute("visibility", "hidden");

    function cleanup(reject = true) {
      if (cleanupId) clearTimeout(cleanupId);
      document.body.removeChild(fileInput);
    }

    fileInput.addEventListener("change", () => {
      const files = [...fileInput.files];
      if (!files.length) cleanup();
      clearTimeout(cleanupId);
      resolve([files[0], cleanup.bind(null, true)]);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    const cleanupId = setTimeout(cleanup, 60000);
  });
}

export async function withFileDialog(cb: (file: File) => Promise<void> | void): Promise<void> {
  const [file, destroy] = await openFileDialog();
  await cb(file);
  destroy();
}
