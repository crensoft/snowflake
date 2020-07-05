/**
 * @jest-environment node
 */
import fetch from "cross-fetch";
const api = (a: string) => `http://id:3999/snowflake/${a}`;

describe("Snowflake/Id", () => {
  test("it should return new unique id", async () => {
    const ids = [];

    let iter = 100;
    while (iter--) {
      const res = await fetch(api("id"), {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res) {
        throw new Error("empty res");
      }

      expect(res.status).toBe(200);

      const payload = await res.json();

      expect(payload.id).toBeTruthy();

      ids.push(payload.id);
    }

    expect([...new Set(ids)].length).toBe(100);
  });
});
