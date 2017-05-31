import PropTypes from 'prop-types';
import React from 'react';
import HTMLDocument from 'react-html-document';

// let cssFiles = ['/app.css'];
// let jsFiles = ['/app.js'];

// if (process.env.NODE_ENV === 'development') {
//     cssFiles = ['//localhost:3001/build/app.css'];
//     jsFiles = ['//localhost:3001/build/app.js'];
// }


// stylesheets={cssFiles}
// scripts={jsFiles}

export default function Document(props) {
    return (
        <HTMLDocument
            title={props.title}
            metatags={[
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            ]}
        >
            {props.children}
        </HTMLDocument>
    );
}

Document.propTypes = {
    children: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
};
