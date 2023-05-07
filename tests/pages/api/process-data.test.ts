import { prepareToSave } from "../../../pages/api/process-data";
import { expect, test } from "bun:test";

test("prepareToSave empty", () => {
	expect(prepareToSave([], [], 0)).toEqual([]);
});

test("prepareToSave non empty", () => {
	expect(prepareToSave([], [{ deviceName: "Pardubice", data: { free: 5 } }], 0)).toEqual([["Pardubice", [5]]]);
});

test("prepareToSave non zero hour", () => {
	expect(prepareToSave([], [{ deviceName: "Pardubice", data: { free: 5 } }], 3)).toEqual([["Pardubice", [undefined, undefined, undefined, 5]]]);
});

test("prepareToSave add next hour", () => {
	expect(prepareToSave([["Pardubice", [5]]], [{ deviceName: "Pardubice", data: { free: 8 } }], 1)).toEqual([["Pardubice", [5, 8]]]);
});

test("prepareToSave add next hour with a gap", () => {
	expect(prepareToSave([["Pardubice", [5]]], [{ deviceName: "Pardubice", data: { free: 8 } }], 3)).toEqual([["Pardubice", [5, undefined, undefined, 8]]]);
});

test("prepareToSave add next hour with a gap on the beginning", () => {
	expect(prepareToSave([["Pardubice", [null, 5]]], [{ deviceName: "Pardubice", data: { free: 8 } }], 3)).toEqual([["Pardubice", [null, 5, undefined, 8]]]);
});

test("prepareToSave add new place", () => {
	expect(prepareToSave([["Pardubice", [null, 5]]], [{ deviceName: "Pardubice", data: { free: 8 } }, { deviceName: "Zelene Predmesti", data: { free: 22 } }], 3)).toEqual([["Pardubice", [null, 5, undefined, 8]], ["Zelene Predmesti", [undefined, undefined, undefined, 22]]]);
});
