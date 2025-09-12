import './charList.scss';

import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from "../spinner/Spinner";
import ErrorMessage from '../errorMessage/ErrorMessage';
// import setContent from "../../utils/setContent";

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



const CharList = (props) => {
	const [listOfChars, setCharList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const [charEnded, setCharEnded] = useState(false);
	const {error, loading, getAllCharacters, httpProcess, setHttpProcess} = useMarvelService();

	const focusRef = useRef([]);

	useEffect(() => {
		onRequest(offset, true);
	}, [])

	const focusOnItem = (id) => {
		focusRef.current.forEach(ref => ref.classList.remove('char__item_selected'));
		focusRef.current[id].classList.add('char__item_selected');
		focusRef.current[id].focus();
	}

	const onKeyPress = (e, id, i) => {
		if (e.key === "Enter" || e.key === " ") {
			props.onCharSelected(id);
			focusOnItem(i);
		}
	}

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
		getAllCharacters(9, offset)
			.then(onCharListLoaded)
			.then(() => setHttpProcess('confirmed'));
	}
	const onCharListLoaded = (newListOfChars) => {
		let ended = false;
		if (newListOfChars.length < 9) {
			ended = true;
		}

		setCharList(() => [...listOfChars, ...newListOfChars]);
		setNewItemLoading(() => false);
		setOffset(offset => offset + 9);
		setCharEnded(() => ended)
	}

	const checkImage = (thumbnail, name) => {
		if (thumbnail.includes("image_not_available")) {
			return (<img src={thumbnail} alt={name} className="randomchar__img"
				style={{ objectFit: "contain" }} />);
		} else {
			return <img src={thumbnail} alt={name} className="randomchar__img" />
		}
	}

	function renderList(listOfChars) {
		const items = listOfChars.map(({ thumbnail, name, id }, i) => {
			const img = checkImage(thumbnail, name);
			return (
				<li key={id}
					className="char__item"
					tabIndex="0"
					ref={elem => focusRef.current[i] = elem}
					onClick={() => {
						props.onCharSelected(id);
						focusOnItem(i);
					}}
					onKeyDown={(e) => onKeyPress(e, id, i)}>
					{/* <img src={thumbnail} alt={name} /> */}
					{img}
					<div className="char__name">{name}</div>
				</li>
			);
		});

		return (
			<ul className="char__grid">
				{items}
			</ul>
		);
	}

	const list = renderList(listOfChars);
	return (
		<div className="char__list">
			{setContent(httpProcess, () => list, newItemLoading)}
			<button className="button button__main button__long"
				style={{ 'display': charEnded ? 'none' : 'block' }}
				disabled={newItemLoading}
				onClick={() => onRequest(offset)}>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}



// class CharList extends Component {

// 	marvelService = new MarvelService("ca6ebcdf506dab97c2c0256b367848c4", "f0655c29263c9aa0b053af7c9598228819172c1b");

// 	state = {
// 		listOfChars: [],
// 		error: false,
// 		loading: true,
// 		newItemLoading: false,
// 		offset: 1500,
// 		charEnded: false
// 	}

// 	focusRef = [];
// 	componentDidUpdate(){
// 		console.log("Update! ", this.focusRef.length);
// 	}

// 	focusOnItem = (id) => {
// 		this.focusRef.forEach(ref => ref.classList.remove('char__item_selected'));
// 		this.focusRef[id].classList.add('char__item_selected');
// 		this.focusRef[id].focus();
// 	}

// 	setRef = (ref) => {
// 		this.focusRef.push(ref);
// 	}
// 	onKeyPress = (e, id, i) => {
// 		if (e.key === "Enter" || e.key === " "){
// 			this.props.onCharSelected(id);
// 			this.focusOnItem(i);
// 		}
// 	}

// 	componentDidMount() {
// 		this.onRequest();
// 	}

// 	onCharListLoading = () => {
// 		this.setState({
// 			newItemLoading: true
// 		})
// 	}
// 	onRequest = (offset) => {
// 		this.onCharListLoading();
// 		this.marvelService.getAllCharacters(9, offset)
// 			.then(this.onCharListLoaded)
// 			.catch(this.onError)
// 	}
// 	onCharListLoaded = (newListOfChars) => {
// 		let ended = false;
// 		if (newListOfChars.length < 9){
// 			ended = true;
// 		}
// 		this.setState(({listOfChars, offset}) => ({
// 			listOfChars: [...listOfChars, ...newListOfChars],
// 			loading: false,
// 			error: false,
// 			newItemLoading: false,
// 			offset: offset + 9,
// 			charEnded: ended
// 		}))
// 	}
// 	onError = () => {
// 		this.setState({
// 			error: true,
// 			loading: false
// 		})
// 	}
// 	checkImage = (thumbnail, name) => {
// 		if (thumbnail.includes("image_not_available")) {
// 			return (<img src={thumbnail} alt={name} className="randomchar__img"
// 				style={{ objectFit: "contain" }} />);
// 		} else {
// 			return <img src={thumbnail} alt={name} className="randomchar__img" />
// 		}
// 	}

// 	renderList = (listOfChars) => {
// 		console.log('Before:', this.focusRef.length);
// 		const items = listOfChars.map(({ thumbnail, name, id }, i) => {
// 			const img = this.checkImage(thumbnail, name);
// 			return (
// 				<li key={id} 
// 				className="char__item"
// 				tabIndex="0"
// 				ref={this.setRef}
// 				onClick={() => {
// 					this.props.onCharSelected(id);
// 					this.focusOnItem(i);
// 					}}
// 				onKeyDown={(e) => this.onKeyPress(e, id, i)}>
// 					{/* <img src={thumbnail} alt={name} /> */}
// 					{img}
// 					<div className="char__name">{name}</div>
// 				</li>
// 			);
// 		});
// 		console.log('After:', this.focusRef.length);
// 		return (
// 			<ul className="char__grid">
// 				{items}
// 			</ul>
// 		);
// 	}

// 	render() {
// 		console.log(this.focusRef);
// 		const { listOfChars, error, loading, offset, newItemLoading, charEnded } = this.state
// 		const list = this.renderList(listOfChars);
// 		const errorMessage = error ? <ErrorMessage /> : null;
// 		const spinner = loading ? <Spinner /> : null;
// 		const items = !(loading || error) ? list : null;
// 		return (
// 			<div className="char__list">
// 				{errorMessage}
// 				{spinner}
// 				{items}
// 				<button className="button button__main button__long"
// 				style={{'display': charEnded ? 'none' : 'block'}}
// 				disabled={newItemLoading}
// 				onClick={() => this.onRequest(offset)}>
// 					<div className="inner">load more</div>
// 				</button>
// 			</div>
// 		)
// 	}
// }

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}
export default CharList;