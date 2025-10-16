import type { APIRoute } from "astro";

// Some themes/tools expect /images/icon.png to exist. Provide a tiny 1x1 PNG or redirect to favicon.
// Here we redirect to the existing public favicon to avoid 404s without adding duplicate assets.
export const GET: APIRoute = async ({ redirect }) => {
  return redirect("/assets/favicon.png", 302);
};
