import kv from "@vercel/kv";
import { z } from "zod";

const DbRecord = z.array(
	z.tuple([
		z.string(), // id
		z.array(z.nullable(z.number()))]) // values per hour
);

type DbRecord = z.infer<typeof DbRecord>;

const AllDbRecords = z.array(
	z.tuple([
		z.string(), // date
		DbRecord,
	])
);

type AllDbRecords = z.infer<typeof AllDbRecords>

const DbRecordAvg = z.array(
	z.tuple([
		z.string(),	// id
		z.array(
			z.tuple([
				z.string(),	// date
				z.number(),	//value
			])
		),
	])
);

type DbRecordAvg = z.infer<typeof DbRecordAvg>

function calculateAverage(a: (null | number)[]) {
	if (!a.length) {
		return NaN;
	}

	let nonNull = 0;
	const sum = a.reduce((acc, current) => {
		if (typeof current === "number") {
			nonNull++;
			return (acc ?? 0) + current;
		}

		return acc;
	}, 0);

	return (sum ?? 0) / nonNull;
}

export function dailyAverage(allDbRecords: AllDbRecords): DbRecordAvg {
	const result: DbRecordAvg = [];

	for (const record of allDbRecords) {
		const date = record[0];

		for (const location of record[1]) {
			const locationId = location[0];
			const average = calculateAverage(location[1]);

			const index = result.findIndex((r) => r && r[0] === locationId);

			console.log({locationId, index});
			if (index >= 0) {
				/*const x = result[index];
				x[1].push([
					date,
					average,
				]);*/
			} else {
				result.push([
					locationId,
					[
						[
							date,
							average,
						],
					],
				]);
			}
		}
	}

	return result;
}

export default async function handler(req, res) {
	const data: AllDbRecords = [];
	for await (const key of kv.scanIterator()) {
		if (key.startsWith("pardubice")) {
			const saved = await kv.get(key);
			const date = key.replace("pardubice-", "");
			console.log("key", key);
			console.log("data", saved);

			/*data.push([
				date,
				DbRecord.parse(saved),
			]);*/
		}
	}

	//console.log(JSON.stringify(data, null, 2));
	//const averaged = dailyAverage(data);

	res.status(200).json({ status: "OK", data: [] });
}
