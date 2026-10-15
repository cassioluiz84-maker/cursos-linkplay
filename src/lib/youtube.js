export function youtubeId(value) {
  if (!value?.trim()) return null;
  try {
    const input = value.trim();
    const url = new URL(
      /^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`,
    );
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.port
    )
      return null;
    const host = url.hostname.toLowerCase();
    let id;
    if (host === "youtu.be") id = url.pathname.split("/")[1];
    else if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)
    ) {
      const parts = url.pathname.split("/");
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else if (["shorts", "embed"].includes(parts[1]) && parts.length === 3)
        id = parts[2];
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id || "") ? id : null;
  } catch {
    return null;
  }
}
export function validateVideo(values, videos, editingId) {
  if (!values.url.trim()) return "Informe o link do YouTube.";
  if (!youtubeId(values.url))
    return "Informe um link válido de vídeo do YouTube (watch, youtu.be, shorts ou embed).";
  if (!values.title.trim()) return "Informe o título do vídeo.";
  if (!values.courseId) return "Selecione um curso para o vídeo.";
  if (!values.category.trim()) return "Informe a categoria do vídeo.";
  if (
    videos.some(
      (video) =>
        video.id !== editingId && video.youtubeId === youtubeId(values.url),
    )
  )
    return "Este vídeo já está cadastrado, mesmo que o link tenha outro formato.";
  return "";
}
