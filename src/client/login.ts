
export async function login(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const loginTab = window.open("/.netlify/functions/authorize", "_blank");

    const checkId = setInterval(() => {
      if (!loginTab.closed) return;
      clearInterval(checkId);
      clearTimeout(timeoutId);
      resolve(true);
    }, 100);

    const timeoutId = setTimeout(() => {
      resolve(false);
    }, 60000);
  });
}
