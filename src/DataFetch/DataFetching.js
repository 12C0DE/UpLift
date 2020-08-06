import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DataFetching(props) {
	const [ posts, setPosts ] = useState([]);

	useEffect(
		() => {
			axios
				.get(props.url)
				.then((res) => {
					console.log(res);
					setPosts(res.data);
				})
				.catch((err) => {
					console.log(`err: ${err}`);
				});
		},
		[ props.url ]
	);

	return (
		<div>
			<ul>{posts.map((post) => <li key={post.id}>{post.description}</li>)}</ul>
		</div>
	);
}

export default DataFetching;
