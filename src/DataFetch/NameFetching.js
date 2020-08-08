import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GlobalContext } from "../Context/GlobalState";

function NameFetching(props) {
  const [posts, setPosts] = useState([]);
  const {
    IsLoading,
    selectItem,
    setExDesc,
    setExEquip,
    setExName,
    setMuscles,
    setMuscles2nd,
    showCategory
  } = useContext(GlobalContext);

  useEffect(() => {
    IsLoading(true);
    axios
      .get(props.url)
      .then(res => {
        setPosts(res.data);
        IsLoading(false);
      })
      .catch(err => {
        console.log(`err: ${err}`);
        IsLoading(false);
      });
  }, [props.url]);

  //   function setExValues(itemId, category) {
  //     selectItem(itemId);
  //     showCategory(category);
  //   }
  function setExValues(post) {
    selectItem(+post.id);
    showCategory(props.category);

    if (props.path === "/exercise") {
      setExDesc(post.description);
      setExEquip(post.equipment);
      setExName(post.name);
      setMuscles(post.muscles);
      setMuscles2nd(post.muscles_secondary);
    }
  }

  return (
    <div>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link
              to={props.path}
              onClick={() => {
                //     setExValues(+post.id, props.category);
                //   }}
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
