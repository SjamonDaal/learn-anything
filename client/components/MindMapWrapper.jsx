import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MindMap from 'react-mindmap';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

@connect(store => ({
  connections: store.map.connections,
  nodes: store.map.nodes,
}))
export default class MindMapWrapper extends Component {
  render() {
    const pathname = window.location.pathname;

    return (
      <div>
        {pathname === '/thank-you' ? '' : <Breadcrumbs />}
        <MindMap
          connections={this.props.connections}
          nodes={this.props.nodes}
        />
      </div>
    );
  }
}
