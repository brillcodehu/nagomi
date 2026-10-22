// Next 16: a middleware konvenció proxy-ra változott. Az admin felület védelme.
export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: ["/admin/:path*"],
};
