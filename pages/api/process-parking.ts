import { processParking } from "../../lib/parking/process-parking";

export default async function handler(req, res) {
	await processParking();

	res.status(200).json({ status: "OK" });
}
