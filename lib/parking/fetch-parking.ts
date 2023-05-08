import fetch from "node-fetch";
import { z } from "zod";
import { fetchPlzen } from "./fetchers/fetch-plzen";

const CITIES = {
	pardubice: "pardubice",
};

const ChytrejsiParkingResponse = z.object({
	data: z.array(
		z.object({
			devID: z.string(),
			deviceName: z.string(),
			appName: z.string(),
			position: z.object({
				lat: z.number(),
				lng: z.number(),
			}),
			data: z.object({
				total: z.number(),
				free: z.number(),
			}),
		})
	),
});

const Parking = z.object({
	name: z.string(),
	code: z.string(),
	city: z.string(),
	total: z.number(),
	free: z.number(),
});

export type Parking = z.infer<typeof Parking>

export async function fetchPardubice(): Promise<Parking[]> {
	const response = await fetch("https://pardubice.chytrejsiparking.cz/admin/api/app/parking/occupancy?placeTypes=common&locale=cs", {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Host": "pardubice.chytrejsiparking.cz",
			"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0",
			"Referer": "https://pardubice.chytrejsiparking.cz/occupancy.html",
		},
	});

	const json = await response.json();

	const { data } =  ChytrejsiParkingResponse.parse(json);

	return data.map((record) => ({
		name: record.appName,
		code: record.devID,
		city: CITIES.pardubice,
		total: record.data.total,
		free: record.data.free,
	}));
}

export async function fetchParking(): Promise<Parking[]> {
	const result = await Promise.all([fetchPardubice(), fetchPlzen() ]);

	return result.flat();
}
