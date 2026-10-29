export const getYoutubeEmbedUrl = (url?: string) => {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    let videoId: string | null | undefined;

    if (hostname === "youtu.be") {
      videoId = segments[0];
    } else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(hostname)) {
      videoId = parsedUrl.searchParams.get("v")
        ?? (["embed", "shorts", "live"].includes(segments[0]) ? segments[1] : undefined);
    }

    return videoId && /^[\w-]{11}$/.test(videoId)
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : "";
  } catch {
    return "";
  }
};
