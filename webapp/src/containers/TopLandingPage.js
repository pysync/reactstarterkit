import React, {Component} from 'react';
import {connect} from 'react-redux';

import '../css/TopLandingPage.css'

import Logo from '../components/PageLogo';
import LPHeader from '../components/LPHeader';
import TopLPNav from '../containers/TopLPNav';
import Exploder from '../containers/Exploder';
import LPBaner01 from '../components/LPBaner01';
import LPBaner02 from '../components/LPBaner02';
import PageFooter from '../components/PageFooter';
import TopNEvents from '../containers/TopNEvents';

class TopLandingPage extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div className='top-lp'>
        <LPHeader>
          <div className="ui secondary menu stackable lp-header-nav">
             <Logo/>
             <div className="right menu">
              <TopLPNav />
             </div>
          </div>
          <div className="title-introduce">
            <h1 className="title-header">食べる作る集まる。きっと何かはじまる。</h1>
            <p className="title-des">グルメのためのフードイベントサービス</p>
          </div>
          <Exploder location={this.props.location} params={this.props.params}/>

        </LPHeader>

        <LPBaner01/>

        <div className='lp-main'>
          <div className='ui container'>
            <TopNEvents title='スペシャル'
                         linkTitle='ALL'
                         query={{special: true}}
                         limit={4}
             />
             <TopNEvents title='トレンドテーブル'
                         linkTitle='ALL'
                         query={{trend: true}}
                         limit={4}
             />
             <TopNEvents title='最新テーブル'
                         linkTitle='ALL'
                         query={{latest: true}}
                         limit={4}
             />
          </div>
        </div>

        <LPBaner02/>
        <PageFooter/>
      </div>
    )
  }
}
/*
TODO: mapping auth state to disable Banner-01, Banner-02
*/

const mapStateToProps = (state, ownProps) => ({

})

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(mapStateToProps,
                       mapDispatchToProps)(TopLandingPage)
