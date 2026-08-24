import axios from "axios";

// The browser talks to the API through a relative path; the server needs an absolute one
// because a Server Component calling its own route handlers has no origin to inherit.
const baseURL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL ?? `http://localhost:${process.env.PORT ?? 3000}/api`
    : "/api";

export const http = axios.create({ baseURL });
