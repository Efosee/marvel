import CommicsHeader from "../commicsHeader/commicsHeader";
import { useLocation } from "react-router-dom";

import './singleCharPage.scss';

export default function SingleCharPage() {
	const location = useLocation();
	const { charData: data } = location.state || {};
	return (
		<>
			<CommicsHeader />
			<View data={data} />
		</>
	);
}

const View = ({data}) => {
	const { thumbnail, name, description } = data;

	return (
		<div className="single-char">
			<img src={thumbnail} alt={name} className="single-char__img" />
			<div className="single-char__info">
				<div className="single-char__title">{name}</div>
				<div className="single-char__description">{description}</div>
			</div>

		</div>
	)
}
