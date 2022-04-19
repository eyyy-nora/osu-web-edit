const mimetypeExtensions = {
  ".mp3": "audio/mp3",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
}


export function mimetypeFor(fileName: string): string {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  return mimetypeExtensions[ext] ?? "application/octet-stream";
}
