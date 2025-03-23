import {afterAll, afterEach, beforeAll} from "vitest"
import { servers } from "./node"

beforeAll(() => servers.listen());
afterEach(() => servers.resetHandlers())
afterAll(() => servers.close())