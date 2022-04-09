
export function scriptBody(script: string, title = "Script"): string {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <script>${script}</script>
  </head>
  <body></body>
</html>`
}

export function windowClose(title?: string): string {
  return scriptBody("if (window.opener && !window.opener.closed) window.close(); else location.href = 'https://owe.monster/';", title);
}
