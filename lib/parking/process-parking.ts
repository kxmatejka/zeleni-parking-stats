import { fetchParking } from "./fetch-parking";
import { saveParking } from "./save-parking";

export async function processParking() {
	console.log("start processing parking");
	const parking = await fetchParking();

	console.log(`fetched ${parking.length} records`);
	await saveParking(parking);

	console.log("saved");
}
