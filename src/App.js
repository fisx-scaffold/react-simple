/**
 * @file 应用的根组件
 * @author ${#author#}
 */

import React from 'react';

class App extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

export default App;
