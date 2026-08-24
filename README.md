# Ecommerce Clean Architecture

Study project applying Clean Architecture and SOLID on top of Next.js (App Router).

## Layers

```
src/@core/                      framework-agnostic core
  domain/entities/              Product, Cart, Order (business rules and invariants)
  domain/gateways/              ports: ProductGateway, CartGateway, OrderGateway
  application/                  use cases, depend only on the ports above
  infra/gateways/               adapters: HTTP (axios) and localStorage
  infra/container-registry.ts   inversify wiring (composition root)

src/server/db.ts                dev datastore backed by db.json
src/app/api/                    route handlers (the backend the HTTP gateways talk to)
src/app/                        pages and client components
src/contexts/cart.provider.tsx  React state on top of the cart use cases
```

The dependency rule is enforced by imports: `domain` imports nothing, `application` imports
only `domain`, `infra` implements `domain` ports, and the UI only knows use cases.

## Scripts

```bash
yarn dev          # http://localhost:3000
yarn build        # production build
yarn start        # production server
yarn test         # unit + integration tests (vitest)
yarn typecheck    # tsc --noEmit
yarn lint
```

Set `NEXT_PUBLIC_API_URL` to point the gateways at a different API. Server-side rendering
needs an absolute URL, so the default is `http://localhost:$PORT/api`.

## Tests

- **Unit** — entities and use cases against in-memory fakes (`test/fakes.ts`), and gateways
  against a stubbed axios instance.
- **Integration** — `test/`: the container resolving the whole graph, the cart round-tripping
  through `localStorage`, the route handlers against a temp `db.json`, and a checkout flow
  that crosses every layer using an axios adapter that calls the route handlers in-process
  (`test/api-adapter.ts`), so no server is needed.

## Notes

- `db.json` is a development datastore, rewritten on every order; it is not concurrency safe.
- Orders never store the full card number — the API masks it down to the last four digits.
