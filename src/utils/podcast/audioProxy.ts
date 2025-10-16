const PROXY_HOST_SUFFIXES = ["xiaoyuzhoufm.com", "xyzcdn.net"];

function hostnameMatchesSuffix(hostname: string, suffix: string) {
  return hostname === suffix || hostname.endsWith(`.${suffix}`);
}

function isAllowedHost(url: URL) {
  return PROXY_HOST_SUFFIXES.some(suffix =>
    hostnameMatchesSuffix(url.hostname, suffix)
  );
}

export function shouldProxyAudioUrl(rawUrl: string): boolean {
  if (rawUrl.startsWith("/")) {
    return false;
  }
  try {
    const parsed = new URL(rawUrl);
    return (
      ["http:", "https:"].includes(parsed.protocol) && isAllowedHost(parsed)
    );
  } catch (error) {
    return false;
  }
}

export function buildAudioProxyUrl(rawUrl: string): string {
  const encoded = encodeURIComponent(rawUrl);
  return `/api/podcast/audio?url=${encoded}`;
}

export function getPlaybackUrl(rawUrl: string): string {
  if (!rawUrl) {
    console.warn("[AudioProxy] getPlaybackUrl called with empty url");
    return "";
  }
  return shouldProxyAudioUrl(rawUrl) ? buildAudioProxyUrl(rawUrl) : rawUrl;
}

export function getEpisodePlaybackUrl(episode: {
  enclosure: { url: string };
  proxyAudioUrl?: string | null;
}): string {
  const candidate =
    episode.proxyAudioUrl ?? getPlaybackUrl(episode.enclosure.url);
  if (candidate && candidate.length > 0) {
    return candidate;
  }
  console.warn(
    "[AudioProxy] Falling back to original enclosure url due to empty candidate",
    episode
  );
  return episode.enclosure.url;
}

export const audioProxyConfig = {
  allowedHostSuffixes: PROXY_HOST_SUFFIXES,
};
