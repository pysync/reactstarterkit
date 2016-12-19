import _ from 'lodash';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import '../css/ShareButton.css';

const ShareButton = (props) => (
  <button className='ui button share-button' onClick={props.onShare}>Share</button>
)

ShareButton.propTypes = {
  onShare: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onShare: ()=> { console.log('on Share')}
})

export default connect(mapStateToProps,
                       mapDispatchToProps)(ShareButton)
