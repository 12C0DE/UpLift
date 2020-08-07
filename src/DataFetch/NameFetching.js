import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GlobalContext } from "../Context/GlobalState";

function NameFetching(props) {
  const [posts, setPosts] = useState([]);
  const { selectItem, showCategory } = useContext(GlobalContext);

  useEffect(() => {
    axios
      .get(props.url)
      .then(res => {
        setPosts(res.data);
      })
      .catch(err => {
        console.log(`err: ${err}`);
      });
  }, [props.url]);

  function setCategoryValues(itemId, category) {
    selectItem(itemId);
    showCategory(category);
  }

  return (
    <div>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link
              to="/lifts"
              onClick={() => {
                setCategoryValues(+post.id, props.category);
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
