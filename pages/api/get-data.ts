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

const DataForFe = z.array(
	z.object({
		id: z.string(),
		days: z.array(
			z.object({
				date: z.string(),
				total: z.number(),
				free: z.number(),
				used: z.number(),
				occupancy: z.number(),
			})
		),
	})
);

type DataForFe = z.infer<typeof DataForFe>

function calculateAverage(a: (null | number)[]) {
	let nonNull = 0;
	const sum = a.reduce((acc, current) => {
		if (typeof current === "number") {
			nonNull++;
			return (acc ?? 0) + current;
		}

		return acc;
	}, 0);

	if (!nonNull) {
		return NaN;
	}

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

			if (index >= 0) {
				const x = result[index];

				console.log(x[1][0][0], date);

				if (!(x[1].find((r) => r[0] === date))) {
					x[1].push([
						date,
						average,
					]);
				}


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

const CONFIG = {
	"Karla IV > Karlovina": {
		"total": 90,
		"position": { "lat": 50.0358686, "lng": 15.7799481 },
	},
	"17. Listopadu > Atrium Palace": {
		"total": 651,
		"position": { "lat": 50.0350769, "lng": 15.7701317 },
	},
	"Závodu míru > Atrium Palace": {
		"total": 651,
		"position": { "lat": 50.0387017, "lng": 15.7671156 },
	},
	"Jiráskova": {
		"total": 94,
		"position": { "lat": 50.036409538699445, "lng": 15.779506713458929 },
	},
	"Čs. Legií": {
		"total": 112,
		"position": { "lat": 50.033542744738, "lng": 15.7702691853046 },
	},
	"Palackého třída > Atrium Palace": {
		"total": 651,
		"position": { "lat": 50.033423860015134, "lng": 15.75745219918257 },
	},
	"Arnošta z Pardubic": {
		"total": 135,
		"position": { "lat": 50.034813352156981, "lng": 15.779565706094385 },
	},
	"Palackého třída > Karlovina": {
		"total": 90,
		"position": { "lat": 50.0332569, "lng": 15.7578958 },
	},
	"Smilova": {
		"total": 39,
		"position": { "lat": 50.0333031863024, "lng": 15.7702839374542 },
	},
	"Poděbradská > Karlovina": {
		"total": 90,
		"position": { "lat": 50.057314423827336, "lng": 15.760043280626135 },
	},
	"kpt. Jaroše > Karlovina": {
		"total": 90,
		"position": { "lat": 50.0315767, "lng": 15.7841575 },
	},
	"Teplého > Karlovina": {
		"total": 90,
		"position": { "lat": 50.0270511, "lng": 15.7678656 },
	},
	"Teplého > Atrium Palace": {
		"total": 651,
		"position": { "lat": 50.027100430773764, "lng": 15.768014805818396 },
	},
	"Hradecká > Atrium Palace": {
		"total": 651,
		"position": { "lat": 50.0500089208961, "lng": 15.765209197998 },
	},
	"nábř. V. Havla": {
		"total": 94,
		"position": { "lat": 50.040256362793876, "lng": 15.768743012212383 },
	},
	"kpt. Jaroše > Atrium Palace": {
		"total": 651,
		"position": { "lat": 50.0315786074335, "lng": 15.784226067895053 },
	},
	"Hradecká > Karlovina": {
		"total": 90,
		"position": { "lat": 50.0502689, "lng": 15.7654392 },
	},
	"Poděbradská > Atrium Palace": {
		"total": 651,
		"position": { "lat": 50.0573179061365, "lng": 15.7599949836731 },
	},
};

export function enrichData(dbRecordAvg: DbRecordAvg): DataForFe {
	const result: DataForFe = [];

	for (const rec of dbRecordAvg) {
		const [key, data] = rec;

		result.push({
			id: key,
			days: data.map((rec) => {
				const [date, avg] = rec;
				const config = CONFIG[key];
				const used = config.total - avg;

				return {
					date,
					total: config.total,
					free: avg,
					used: used,
					occupancy: used / config.total * 100,
				};
			}),
		});
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

			data.push([
				date,
				DbRecord.parse(saved),
			]);
		}
	}

	//console.log(JSON.stringify(data, null, 2));
	const averaged = dailyAverage(data);

	res.status(200).json({ status: "OK", data: enrichData(averaged) });
}
