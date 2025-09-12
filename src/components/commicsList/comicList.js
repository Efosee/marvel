import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import useMarvelService from '../../services/MarvelService';
import './commicList.scss';
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const setContent = (httpProcess, Component, newItemLoading) => {
	switch(httpProcess){
			case "waiting":
				return <Spinner />
			case "loading":
				return newItemLoading ? <Component /> : <Spinner />;
			case "confirmed":
				return <Component/>
			case "error":
				return <ErrorMessage />
			default:
				return new Error("Unexpected process state");
		}
} 

function ComicsList() {
	const [comicsList, setComicsList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const [comicsEnded, setComicsEnded] = useState(false);
	const { error, loading, getAllComics, httpProcess, setHttpProcess } = useMarvelService();

	const focusRef = useRef([]);

	const focusOnItem = (id) => {
		focusRef.current.forEach(ref => ref.classList.remove('comics__item_selected'));
		focusRef.current[id].classList.add('comics__item_selected');
		focusRef.current[id].focus();
	}

	const onKeyPress = (e, id, i) => {
		if (e.key === "Enter" || e.key === " ") {
			focusOnItem(i);
		}
	}

	useEffect(() => {
		onRequest(offset, true)
	}, [])

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
		getAllComics(8, offset)
			.then(onCharListLoaded)
			.then(() => setHttpProcess('confirmed'));
	}
	const onCharListLoaded = (newComicsList) => {
		let ended = false;
		if (newComicsList.length < 8) {
			ended = true;
		}

		setComicsList(() => [...comicsList, ...newComicsList]);
		setNewItemLoading(() => false);
		setOffset(offset => offset + 8);
		setComicsEnded(() => ended)
	}

	const checkImage = (thumbnail, name) => {
		if (thumbnail.includes("image_not_available")) {
			return (<img src={thumbnail} alt={name} className="randomchar__img"
				style={{ width: "100%", height: "auto", objectFit: "contain" }} />);
		} else {
			return <img src={thumbnail} alt={name} className="randomchar__img" />
		}
	}


	function renderList(comicsList) {
		const items = comicsList.map(({ thumbnail, title, id, price }, i) => {
			const img = checkImage(thumbnail, title);
			return (
				<li key={id}
					className="comics__item"
					tabIndex="0"
					onClick={() => {
						focusOnItem(i);
					}}
					onKeyDown={(e) => onKeyPress(e, id, i)}>
					<Link to={`/comics/${id}`}
					className="wrapper" ref={elem => focusRef.current[i] = elem}>
						{img}
						<div className="comics__title">{title}</div>
						<div className="comics__price">{price}</div>
					</Link>
				</li>
			);
		});

		return (
			<ul className="comics__grid">
				{items}
			</ul>
		);
	}

	const list = renderList(comicsList);
	// const errorMessage = error ? <ErrorMessage /> : null;
	// const spinner = loading && !newItemLoading ? <Spinner /> : null;
	return (
		<div className="comics__list">
			{setContent(httpProcess, () => list, newItemLoading)}
			<button className="button button__main button__long"
				style={{ 'display': comicsEnded ? 'none' : 'block' }}
				disabled={newItemLoading}
				onClick={() => onRequest(offset)}>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}



export default ComicsList;