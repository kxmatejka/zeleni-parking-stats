import { addToDbRecord } from "../../../pages/api/process-data";
import { expect, test } from "bun:test";

test("addToDbRecord empty", () => {
	expect(addToDbRecord([], [], 0)).toEqual([]);
});

test("addToDbRecord non empty", () => {
	expect(addToDbRecord([], [{ deviceName: "Pardubice", data: { free: 5 } }], 0)).toEqual([["Pardubice", [5]]]);
});

test("addToDbRecord non zero hour", () => {
	expect(addToDbRecord([], [{ deviceName: "Pardubice", data: { free: 5 } }], 3)).toEqual([["Pardubice", [undefined, undefined, undefined, 5]]]);
});

test("addToDbRecord add next hour", () => {
	expect(addToDbRecord([["Pardubice", [5]]], [{ deviceName: "Pardubice", data: { free: 8 } }], 1)).toEqual([["Pardubice", [5, 8]]]);
});

test("addToDbRecord add next hour with a gap", () => {
	expect(addToDbRecord([["Pardubice", [5]]], [{ deviceName: "Pardubice", data: { free: 8 } }], 3)).toEqual([["Pardubice", [5, undefined, undefined, 8]]]);
});

test("addToDbRecord add next hour with a gap on the beginning", () => {
	expect(addToDbRecord([["Pardubice", [undefined, 5]]], [{ deviceName: "Pardubice", data: { free: 8 } }], 3)).toEqual([["Pardubice", [undefined, 5, undefined, 8]]]);
});

test("addToDbRecord add new place", () => {
	expect(addToDbRecord([["Pardubice", [undefined, 5]]], [{ deviceName: "Pardubice", data: { free: 8 } }, { deviceName: "Zelene Predmesti", data: { free: 22 } }], 3)).toEqual([["Pardubice", [undefined, 5, undefined, 8]], ["Zelene Predmesti", [undefined, undefined, undefined, 22]]]);
});
