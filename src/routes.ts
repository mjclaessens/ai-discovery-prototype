/** Central route path strings — use these with `<Route>`, `<Link>`, and `navigate()`. */
export const ROUTES = {
  home: "/",
  search: "/search",
  /** Use in `<Route path={...}>` — ids like `default:2` are passed URL-encoded in the location. */
  productPath: "/product/:courseId",
  /** Course ids may contain `:` — always use this helper for hrefs and `navigate()`. */
  product: (courseId: string) => `/product/${encodeURIComponent(courseId)}`,
} as const;
