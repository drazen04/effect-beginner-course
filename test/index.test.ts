import {afterAll, afterEach, beforeAll, expect, it} from "vitest"
import { servers } from "./node"
import { Layer, Effect, ConfigProvider } from "effect";
import { PokeApi } from "../src/PokeApi";

beforeAll(() => servers.listen());
afterEach(() => servers.resetHandlers())
afterAll(() => servers.close())

const TestProvider = ConfigProvider.fromMap(
  new Map([["BASE_URL", "http://localhost:3000"]])
)

const ConfigProviderLayer = Layer.setConfigProvider(TestProvider)

const MainLayer = PokeApi.Default.pipe(
  Layer.provide(ConfigProviderLayer)
)

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon;
})

const main = program.pipe(Effect.provide(MainLayer))

it("return a valid pokemon", async () => {
    const response = await Effect.runPromise(main)
    
    expect(response).toEqual({
        id: 1,
        name: "brokemon",
        height: 12,
        weight: 100,
        order: 1   
    })
})