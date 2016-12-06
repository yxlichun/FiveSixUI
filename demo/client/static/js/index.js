import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Homepage from './homepage';

import { render } from 'react-dom';

render (
    <div>
        <Router history={hashHistory}>
            <Route path="/" component={Homepage}>
            </Route>
        </Router>
    </div>,
    
    document.getElementById('main-container')
)