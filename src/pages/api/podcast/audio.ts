import type { APIRoute } from "astro";
import { audioProxyConfig } from "@utils/podcast/audioProxy";

const PASS_THROUGH_HEADERS = [
  "content-type",
  "content-length",
  "accept-ranges",
  "content-range",
  "etag",
  "last-modified",
  "cache-control",
];

function isAllowedTarget(url: URL) {
  return audioProxyConfig.allowedHostSuffixes.some(suffix => {
    return url.hostname === suffix || url.hostname.endsWith(`.${suffix}`);
  });
}

async function proxyAudio(request: Request, method: "GET" | "HEAD") {
  const requestUrl = new URL(request.url);
  const targetUrlParam = requestUrl.searchParams.get("url");

  if (!targetUrlParam) {
    return new Response(JSON.stringify({ error: "Missing url parameter" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  let target: URL;
  try {
    target = new URL(targetUrlParam);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid url parameter" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (!isAllowedTarget(target)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  console.info("[AudioProxy] Proxying", target.toString());

  const upstreamHeaders: Record<string, string> = {};
  const rangeHeader = request.headers.get("range");
  if (rangeHeader) {
    upstreamHeaders.Range = rangeHeader;
  }

  const refererHeader = request.headers.get("referer");
  if (refererHeader) {
    upstreamHeaders.Referer = refererHeader;
  }

  const userAgent =
    request.headers.get("user-agent") ??
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
  upstreamHeaders["User-Agent"] = userAgent;

  try {
    const upstream = await fetch(target, {
      method,
      headers: upstreamHeaders,
      redirect: "follow",
    });

    if (!upstream.ok && upstream.status !== 206) {
      console.warn(
        "[AudioProxy] Upstream request failed",
        upstream.status,
        target.toString()
      );
      return new Response(
        JSON.stringify({
          error: "Upstream request failed",
          status: upstream.status,
        }),
        {
          status: upstream.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const responseHeaders = new Headers();
    PASS_THROUGH_HEADERS.forEach(header => {
      const value = upstream.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    if (!responseHeaders.has("cache-control")) {
      responseHeaders.set(
        "Cache-Control",
        "public, max-age=3600, s-maxage=86400"
      );
    }

    responseHeaders.set("Access-Control-Allow-Origin", "*");

    const body = method === "HEAD" ? null : upstream.body;

    return new Response(body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[AudioProxy] Failed to fetch upstream audio", error);
    return new Response(JSON.stringify({ error: "Bad gateway" }), {
      status: 502,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

export const GET: APIRoute = async ({ request }) => proxyAudio(request, "GET");
export const HEAD: APIRoute = async ({ request }) =>
  proxyAudio(request, "HEAD");
