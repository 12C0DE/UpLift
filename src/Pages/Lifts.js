import React from 'react';
import NameFetching from '../DataFetch/NameFetching';
import { Link } from 'react-router-dom';

export const Lifts = () => {
   
    return (
        <div>
            <h1>Lifts</h1>
            <div>
                <h2>Muscle groups</h2>
<NameFetching url="https://wger.de/api/v2/exercisecategory/?status=2" />
            </div>
            <div>
                <h2>Equipment</h2>
                <NameFetching url='https://wger.de/api/v2/equipment/?status=2' />
            </div>
            <div>
                <h2>Muscles</h2>
                <NameFetching url='https://wger.de/api/v2/muscle/?status=2' />
            </div>
<Link to='/'>Back Home</Link>
        </div>
    );
};