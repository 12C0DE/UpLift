import React from 'react';
import NameFetching from '../DataFetch/NameFetching';
import { Link } from 'react-router-dom';

export const Lifts = () => {
   
    return (
        <div>
            <h1>Lifts</h1>
<NameFetching url="https://wger.de/api/v2/exercisecategory/?status=2" />
<Link to='/'>Back Home</Link>
        </div>
    );
};