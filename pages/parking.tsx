import { useEffect, useState } from "react";

export default function Page() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch("/api/get-data")
			.then((res) => res.json())
			.then((res) => {
				setLoading(false);
				setData(res.data);
			})
			.catch(() => setError(true));
	});

	if (error) {
		return <div>something went wrong</div>;
	}

	if (loading) {
		return <div>loadings</div>;
	}

	return null;
}
