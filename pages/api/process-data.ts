import kv from "@vercel/kv";
import { z } from "zod";
import { fetchPardubice } from "../../lib/process-data/fetcher";
import type { PardubiceResponse } from "../../lib/process-data/fetcher";

function getDateTime() {
	const currentDate = new Date();

	return {
		year: currentDate.getUTCFullYear(),
		month: currentDate.getUTCMonth() + 1,
		day: currentDate.getUTCDate(),
		hour: currentDate.getUTCHours(),
	};
}

const DbRecord = z.array(z.tuple([z.string(), z.array(z.nullable(z.number()))]));

type DbRecord = z.infer<typeof DbRecord>;

export function createDbRecord(dataFromApi: PardubiceResponse, currentHour: number) {
	const newDataToSave: DbRecord = [];

	for (const rec of dataFromApi) {
		const a: number[] = [];
		a[currentHour] = rec.data.free;
		newDataToSave.push([rec.deviceName, a]);
	}

	return newDataToSave;
}

export function prepareToSave(dbRecord: DbRecord, dataFromApi: PardubiceResponse, currentHour: number) {
	const newDataToSave: DbRecord = [];

	for (const rec of dataFromApi) {
		const dbRecordX = dbRecord.find((r) => r[0] === rec.deviceName);
		let a: (number|null)[] = (dbRecordX) ? [...dbRecordX[1]] : [];
		a[currentHour] = rec.data.free;
		newDataToSave.push([rec.deviceName, a]);
	}

	return newDataToSave;
}

export default async function handler(req, res) {
	const { year, month, day, hour } = getDateTime();
	const dataFromApi = await fetchPardubice();

	const key = `pardubice-${year}-${month}-${day}`;
	const saved = await kv.get(key);

	const parsed = DbRecord.parse(saved ?? []);

	const toSave = prepareToSave(parsed, dataFromApi, hour);

	await kv.set(key, JSON.stringify(toSave));

	res.status(200).json({ status: "OK" });
}
