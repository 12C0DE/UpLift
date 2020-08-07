import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../Context/GlobalState';

function NameFetching(props) {
	const [ posts, setPosts ] = useState([]);
	const { selectedCategory, showCategory } = useContext(GlobalContext);

	useEffect(
		() => {
			axios
				.get(props.url)
				.then((res) => {
					console.log(res.data);
					setPosts(res.data);
				})
				.catch((err) => {
					console.log(`err: ${err}`);
				});
		},
		[ props.url ]
	);

	function setCategoryValues(catId, category) {
		showCategory(category);
		selectedCategory(catId);
	}

	return (
		<div>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>
						<Link to="/lifts">{post.name}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default NameFetching;
