import React from 'react';
import ReactDOM, {Root} from 'react-dom/client';
import './index.scss';
import App from './App';

const root: Root = ReactDOM.createRoot(document.getElementById('root')!);
root && root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
