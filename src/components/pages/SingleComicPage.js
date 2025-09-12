import './singleComicPage.scss';
import setContent from '../../utils/setContent';
import { Link, Redirect, useParams } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const SingleComicPage = () => {
	const { comicId } = useParams();
	const [comic, setComic] = useState(null);
	const { loading, error, getComic, clearError, httpProcess, setHttpProcess } = useMarvelService();

	useEffect(() => {
		updateComic()
	}, [comicId]);

	const updateComic = () => {
		clearError();

		getComic(comicId)
			.then(onComicLoaded)
			.then(() => setHttpProcess('confirmed'));
	}

	const onComicLoaded = (comic) => {
		setComic(comic);
	}

	const errorMessage = error ? <ErrorMessage /> : null;
	// const errorMessage = error ? <Redirect to="/404"/> : null;
	const spinner = loading ? <Spinner /> : null;
	const content = !(loading || error || !comic) ? <View comic={comic} /> : null;

	return (
		<>
		{setContent(httpProcess, View, comic)}
		</>
	)
}

const View = ({ data }) => {
	const { title, description, thumbnail, price, pageCount, language } = data;
	return (
		<div className="single-comic">
			<img src={thumbnail} alt={title} className="single-comic__img" />
			<div className="single-comic__info">
				<h2 className="single-comic__name">{title}</h2>
				<p className="single-comic__descr">{description}</p>
				<p className="single-comic__descr">{pageCount}</p>
				<p className="single-comic__descr">{language}</p>
				<div className="single-comic__price">{price}</div>
			</div>
			<Link to="/comics" className="single-comic__back">Back to all</Link>
		</div>
	);
}
export default SingleComicPage;