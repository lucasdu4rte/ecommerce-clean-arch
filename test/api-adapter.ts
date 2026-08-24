import { GET as getOrder } from "@/app/api/orders/[id]/route";
import { POST as createOrder } from "@/app/api/orders/route";
import { GET as getProduct } from "@/app/api/products/[id]/route";
import { GET as listProducts } from "@/app/api/products/route";
import axios, { AxiosAdapter, AxiosResponse } from "axios";

const json = (url: string, body: unknown) =>
  new Request(`http://test${url}`, {
    method: "POST",
    body: body as string,
    headers: { "content-type": "application/json" },
  });

async function dispatch(method: string, url: string, body: unknown): Promise<Response> {
  if (method === "POST" && url === "/orders") return createOrder(json(url, body));
  if (url === "/products") return listProducts();

  const orderId = url.match(/^\/orders\/(\d+)$/)?.[1];
  if (orderId) return getOrder(new Request(`http://test${url}`), { params: { id: orderId } });

  const productId = url.match(/^\/products\/(\d+)$/)?.[1];
  if (productId) return getProduct(new Request(`http://test${url}`), { params: { id: productId } });

  throw new Error(`Unhandled request: ${method} ${url}`);
}

const adapter: AxiosAdapter = async (config) => {
  const response = await dispatch(
    (config.method ?? "get").toUpperCase(),
    config.url ?? "",
    config.data
  );

  return {
    data: await response.json(),
    status: response.status,
    statusText: response.statusText,
    headers: {},
    config,
  } as AxiosResponse;
};

/** Axios instance that calls the Next route handlers in-process, no server required. */
export const httpAgainstRouteHandlers = axios.create({ adapter });
