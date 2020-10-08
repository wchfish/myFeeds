import React from 'react'
import ReactDOM from 'react-dom'

import FeedFlow from '../src/components/FeedFlow'

import '../src/styles/normalize.scss';
import '../src/utils/rem.js';

const APP = ()=>{
    return(
        <div>
            <h2>信息流示例</h2>
            <FeedFlow 
                businessId={1000001205142150}
                appid={'newChannel'}
            />
        </div>
    )
}

ReactDOM.render(<APP/>, document.getElementById('app'))
