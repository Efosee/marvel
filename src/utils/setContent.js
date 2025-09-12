import Skeleton from "../components/skeleton/Skeleton";
import Spinner from "../components/spinner/Spinner";
import ErrorMessage from "../components/errorMessage/ErrorMessage";

const setContent = (httpProcess, Component, data) => {
	switch(httpProcess){
			case "waiting":
				return <Skeleton />
			case "loading":
				return <Spinner />
			case "confirmed":
				return <Component data={data} />
			case "error":
				return <ErrorMessage />
			default:
				return new Error("Unexpected process state");
		}
} 

export default setContent;