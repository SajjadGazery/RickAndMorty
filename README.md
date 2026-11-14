# Rick and Morty Characters

Demo: <https://sg-rickandmorty.netlify.app/>

## Stack

Nuxt 4 (SSR), TailwindCSS v4, TypeScript

## Run

```bash
npm i && npm run dev        # http://localhost:3000
npm run build && npm run preview
```

## Architecture

- `server/utils/rick-and-morty.ts`: BFF layer that normalizes the API responses and trims them down to the fields the app needs
- `server/api/characters/*`: internal endpoints (cached via route rules)
- `shared/`: types and query parsers shared between server and app
- `app/pages`: list page (search + pagination via query string) and detail page
- Both pages are server-side rendered with `useFetch`

## Why a server layer?

The public API has rate limits, so a server layer allows caching, response normalization, and consistent error handling.