import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../Context/GlobalState';

function NameFetching(props) {
	const [
		posts,
		setPosts
	] = useState([]);
	const { selectItem, setExDesc, setExEquip, setExName, setMuscles, setMuscles2nd, showCategory } = useContext(
		GlobalContext
	);

	useEffect(
		() => {
			axios
				.get(props.url)
				.then((res) => {
					if (props.url === '/muscles') {
						setPosts(res.data);
					} else {
						setPosts(res.data.results);
					}
				})
				.catch((err) => {
					console.log(`err: ${err}`);
				});
		},
		[
			props.url
		]
	);

	function setExValues(post) {
		selectItem(+post.id);
		showCategory(props.category);

		if (props.path === '/exercise') {
			setExDesc(removeTags(post.description));
			setExEquip(post.equipment);
			setExName(post.name);
			setMuscles(post.muscles);
			setMuscles2nd(post.muscles_secondary);
		}
	}

	function removeTags(text) {
		const regex = new RegExp('</?.[^>]*>', 'g');
		const result = text.replace(regex, '');

		return result;
	}

	return (
		<div>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>
						<Link
							to={props.path}
							onClick={() => {
								setExValues(post);
							}}
						>
							{post.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default NameFetching;
