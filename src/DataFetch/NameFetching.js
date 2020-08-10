import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../Context/GlobalState';

function NameFetching(props) {
	const [ posts, setPosts ] = useState([]);
	const {
		IsLoading,
		muscles,
		selectItem,
		setExDesc,
		setExEquip,
		setExName,
		setMuscles,
		setMuscles2nd,
		showCategory
	} = useContext(GlobalContext);

	useEffect(
		() => {
			IsLoading(true);
			axios
				.get(props.url)
				.then((res) => {
					setPosts(res.data);
					IsLoading(false);
				})
				.catch((err) => {
					console.log(`err: ${err}`);
					IsLoading(false);
				});
		},
		[ props.url ]
	);

	function setExValues(post) {
		selectItem(+post.id);
		showCategory(props.category);

		if (props.path === '/exercise') {
			setExDesc(removeTags(post.description));
			setExEquip(post.equipment);
			setExName(post.name);
			setMuscles(...muscles, post.muscles);
			// setMuscles(post.muscles.map((p) => p.push(p.muscles)));
			setMuscles2nd(...post.muscles_secondary);
			// setMuscles(post.muscles_secondary.map((p) => p.push(p.muscles)));
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
