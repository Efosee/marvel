import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Link } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import './searchForm.scss';

export default function SearchForm() {

	const [error, setError] = useState(false);
	const [data, setData] = useState();
	const { loading, getCharacterByName } = useMarvelService();

	async function searchCharacter(name) {
		try {
			setError(false);
			const result = await getCharacterByName(name);
			setData(result);
		} catch {
			setData(null);
			setError(true);
		}
	}

	return (
		<Formik
			initialValues={{
				"search-input": ""
			}}
			validationSchema={Yup.object({
				"search-input": Yup.string().required("This field is required")
			})}
			onSubmit={(values) => searchCharacter(values["search-input"])}
		>
			{({ values }) => (<Form
				className="search-form"
			>
				<label className="search-form__label" htmlFor="search-input">Or find a character by name:</label>
				<Field
					className="search-form__input"
					id="search-input"
					name="search-input"
					type="text"
					placeholder="Enter name"
				/>
				<button
					className="button button__main">
					<div className="inner">find</div>
				</button>
				{!loading && <ErrorMessage name="search-input" component="div" className="search-form__error" />}
				{!loading && data && values["search-input"] &&
					(<>
						<div className="search-form__message">{`There is! Visit ${data.name} page?`}</div>
						<Link to={{
							pathname: `/char/${data.name}`,
							state: {
								charData: data
							}
						}}
							className="button button__secondary btn-page">
							<div className="inner">To page</div>
						</Link>
					</>
					)}
				{!loading && error && values["search-input"] && <div className="search-form__not-found">The character was not found. Check the name and try again</div>}
				{loading && <Spinner className="search-form__spinner" />}
			</Form>)}
		</Formik>
	);
}