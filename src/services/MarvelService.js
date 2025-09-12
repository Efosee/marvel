import md5 from "md5";
import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {
	
	const {loading, request, error, clearError, httpProcess, setHttpProcess} = useHttp();

	const _baseUrl = "https://gateway.marvel.com/v1/public/";
	const _PUBLICKEY = process.env.REACT_APP_PUBLIC_KEY;
	const _PRIVATEKEY = process.env.REACT_APP_PRIVATE_KEY;

	function createAPIUrl() {
		const ts = Date.now();
		const hash = md5(ts + _PRIVATEKEY + _PUBLICKEY);
		return `ts=${ts}&apikey=${_PUBLICKEY}&hash=${hash}`;
	}
	// getResources = async (url) => {
	// 	try {
	// 		const res = await fetch(url);

	// 		if (!res.ok) {
	// 			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
	// 		}

	// 		return await res.json();

	// 	} catch (error) {
	// 		console.error(error);

	// 	}

	// }

	const getApiAllResources = (limit, offset, res = "characters") => {

		limit = limit ? `limit=${limit}&` : "";
		offset = offset ? `offset=${offset}&` : "";

		const url = _baseUrl + `${res}?${limit}${offset}` + createAPIUrl()
		return request(url);
	}

	const getApiResource = (id, res = "characters") => {
		const url = _baseUrl + `${res}/${id}?` + createAPIUrl();
		return request(url);
	}

	const getApiResourceWithParams = (res, params) => {
		const urlParams = new URLSearchParams(params).toString();
		const url = _baseUrl + `${res}?${urlParams}&` + createAPIUrl();
		return request(url);
	} 

	const getAllCharacters = async (limit, offset) => {
		const apiResource = "characters";
		const res = await getApiAllResources(limit, offset, apiResource);
		return res.data.results.map(_transformCharacter);
	}
	const getCharacter = async (id) => {
		const apiResource = "characters";
		const res = await getApiResource(id, apiResource);
		return _transformCharacter(res.data.results[0]);
	}
	const getCharacterByName = async (name) => {
		const apiResource = "characters";
		const res = await getApiResourceWithParams(apiResource, {name});
		
		if (!res.data.results[0]){
			throw new Error(`Character with name ${name} not found`);
		}
		return _transformCharacter(res.data.results[0]);
	}

	const _transformCharacter = (char) => {
		const { name, description, thumbnail, urls, id, comics } = char;
		return {
			id: id,
			name: name,
			description: description ? `${description.slice(0, 210)}...` : "There is no description for this character",
			thumbnail: thumbnail.path + '.' + thumbnail.extension,
			homepage: urls[0].url,
			wiki: urls[1].url,
			comics: comics.items
		}
	}

	//Comics

	const getAllComics = async (limit, offset) => {
		const apiResource = "comics";
		const res = await getApiAllResources(limit, offset, apiResource);
		return res.data.results.map(_transformComics);
	}

	const getComic = async (id) => {
		const apiResource = "comics";
		const res = await getApiResource(id, apiResource);
		return _transformComics(res.data.results[0]);
	}

	const _transformComics = (comics) => {
		console.log(comics)
		const { title, description, thumbnail, urls, id, prices, pageCount } = comics;
		return {
			id: id,
			title: title,
			description: description ? `${description.slice(0, 210)}...` : "There is no description for this character",
			thumbnail: thumbnail.path + '.' + thumbnail.extension,
			detail: urls[0].url,
			price: prices[0].price !== 0 ? prices[0].price + '$' : "NOT AVAILABLE",
			pageCount: pageCount ? `${pageCount} p.` : "No information about it",
			language: comics.textObject && comics.textObject.language || 'en-us'
		}
	}

	return {getCharacter, getAllCharacters, loading, error, clearError, getAllComics, getComic, getCharacterByName, httpProcess, setHttpProcess}
}
export default useMarvelService;