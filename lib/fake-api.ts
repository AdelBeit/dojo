// Fake async backend for the frontend drills. No real network.
// Tests and pages can configure the delay and failures.
//
//   fakeApi.configure({ delayMs: 1000 })       slow responses
//   fakeApi.configure({ failNext: 1 })         the next call fails, later ones succeed
//   fakeApi.configure({ failAlways: true })    every call fails
//   fakeApi.calls                              every call made so far, in order
//
// Endpoints:
//   POST /check-username  { username }  ->  { available: boolean }   ("admin", "root", "taken" are not available)
//   anything else                       ->  { ok: true }

export type FakeApiConfig = {
  delayMs: number;
  failNext: number;
  failAlways: boolean;
};

export type FakeApiCall = { path: string; body: unknown };

const DEFAULTS: FakeApiConfig = { delayMs: 600, failNext: 0, failAlways: false };
const TAKEN_USERNAMES = ["admin", "root", "taken"];

let config: FakeApiConfig = { ...DEFAULTS };
const calls: FakeApiCall[] = [];

export const fakeApi = {
  configure(partial: Partial<FakeApiConfig>) {
    config = { ...config, ...partial };
  },

  reset() {
    config = { ...DEFAULTS };
    calls.length = 0;
  },

  get calls(): readonly FakeApiCall[] {
    return calls;
  },

  async post(path: string, body: unknown): Promise<unknown> {
    calls.push({ path, body });
    await new Promise((resolve) => setTimeout(resolve, config.delayMs));

    if (config.failAlways || config.failNext > 0) {
      if (config.failNext > 0) config.failNext -= 1;
      throw new Error("Request failed. Please try again.");
    }

    if (path === "/check-username") {
      const username = String((body as { username?: string })?.username ?? "").toLowerCase();
      return { available: !TAKEN_USERNAMES.includes(username) };
    }
    return { ok: true };
  },
};
