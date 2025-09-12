import { useState, useCallback } from "react";

export const useHttp = () => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [httpProcess, setHttpProcess] = useState("waiting");

	const request = useCallback(async (url, method = 'GET', body = null,
		headers = { 'Content-Type': 'application/json' }) => {
			setLoading(true);
			setHttpProcess('loading');

			try {
				const response = await fetch(url, {method, body, headers});
				
				if (!response.ok){
					throw new Error(`Could not fetch ${url}, status ${response.status}`)
				}

				const data = await response.json();

				setLoading(false);
				// setProcess("confirmed") - нельзя, т.к. операции с данными асинхронные и process получит статус confirmed раньше, чем данные будут готовы  
				return data;

			} catch(e) {
				setLoading(false);
				setError(e.message);
				setHttpProcess('error');
				throw e;
			}
	}, []);

	const clearError = useCallback(() => {
		setError(null);
		setHttpProcess('loading')
	}, []);

	return {loading, request, error, clearError, httpProcess, setHttpProcess}
}