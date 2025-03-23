import { http, HttpResponse } from "msw"
import type { Pokemon } from "../src/schemas";

const mockPokemon: Pokemon = {
    id: 1,
    name: "brokemon",
    height: 12,
    weight: 100,
    order: 1
}

export const handlers = [
    http.get("http://localhost:3000/api/v2/pokemon/*", () => {
        return HttpResponse.json(mockPokemon)
    })
]