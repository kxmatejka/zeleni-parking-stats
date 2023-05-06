import fetch from "node-fetch";
import { z } from "zod";

const Data = z.array(z.object({
	deviceName: z.string(),
	data: z.object({
		free: z.number(),
	}),
}));

const Response = z.object({
	data: Data,
});

export type PardubiceResponse = z.infer<typeof Data>;

export async function fetchPardubice() {
	const response = await fetch("https://pardubice.chytrejsiparking.cz/admin/api/parking/panel/list?locale=cs", {
		headers: {
			"Host": "pardubice.chytrejsiparking.cz",
			"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0",
			"Referer": "https://pardubice.chytrejsiparking.cz/occupancy.html",
		},
	});

	const data = await response.json();

	return Response.parse(data).data;
}
