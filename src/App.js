import React from "react";
import axios from "axios";
import Movie from "./movie";
import "./App.css";

// props -> 상위 컴포넌트가 하위 컴포넌트에 내려주는 값(불변)
// state -> 컴포넌트 내부에서 변화하는 값(가변) -> 변함에 따라 render다시 호출 됨

// props X
// state { isLoading, movies }

class App extends React.Component {
	state = {
		isLoading: true,
		movies: [], // 1개
	};

	// this.state.movies
	// movies; XXXXXXXXX
	getMovies = async () => {
		const {
			data: {
				data: { movies },
			},
		} = await axios.get("https://yts.mx/api/v2/list_movies.json");

		// { key: value}
		this.setState({ movies: movies, isLoading: false });
		console.log({ movies });
	};

	componentDidMount() {
		this.getMovies();
	}

	addList = () => {
		const newMovie = {
			year: 1992,
			title: "title",
			summary: "summary",
			poster: "poster",
			genres: ["genres"],
		};
		// this.setState({key: value})
		// 금지
		// this.state.movies.push(newMovie);
		// this.setState({ movies: this.state.movies });
		// OO
		this.setState({ movies: [...this.state.movies, newMovie] });
	};
	render() {
		const { isLoading, movies } = this.state;
		// movies === this.state.movies
		return (
			<section className="container">
				{isLoading ? (
					<div className="loader">
						<span className="loader__text">Loading..</span>
					</div>
				) : (
					<div className="movies">
						<button onClick={() => this.addList()}> addNewMovie</button>
						{/* // 필수적으로 필요한 값은? */}
						{movies.map((movie, idx) => (
							<div key={movie.id}>
								<Movie
									id={movie.id}
									year={movie.year}
									title={movie.title}
									summary={movie.summary}
									poster={movie.medium_cover_image}
									genres={movie.genres}
								/>
								<button
									onClick={() => {
										// react는 state "기존 값"을 절대 변경하면 안됨
										// this.state.movies = [{ ... }] (20)
										// console(this.state.movies)
										// this.state.movies.splice(idx, 1); XXXXXXXXXXX
										// this.state.movies = [{ ... }] (19)
										// this.state.movies <<== 변형됨
										// console(this.state.movies)

										// 임시로 만들어짐
										const newMovies = this.state.movies.filter(
											(currentMovie) => {
												return currentMovie.id !== movie.id;
												//     0~ 20 id        !== 35597
											}
										);
										console.log("원래 state: ", this.state.movies);
										console.log("새로운: ", newMovies);
										this.setState({ movies: newMovies }); // 옳은 방법
									}}
								>
									삭제
								</button>
							</div>
						))}
					</div>
				)}
			</section>
		);
	}
}

export default App;
