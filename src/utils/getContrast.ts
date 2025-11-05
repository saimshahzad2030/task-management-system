export default function getContrastText(bgColor: string) {
  // remove # if exists
  const c = bgColor.charAt(0) === "#" ? bgColor.substring(1) : bgColor;

  // convert to RGB
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);

  // luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.6 ? "black" : "white"; // light bg → black, dark bg → white
}
