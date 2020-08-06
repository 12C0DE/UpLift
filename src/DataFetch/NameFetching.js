import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NameFetching(props) {
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
			<ul>{posts.map((post) => <li key={post.id}>{post.name}</li>)}</ul>
		</div>
	);
}

export default NameFetching;
