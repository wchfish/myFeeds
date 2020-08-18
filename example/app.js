import React from 'react'
import ReactDOM from 'react-dom'

import FeedFlow from '../src/components/FeedFlow'

const APP = ()=>{
    return(
        <div>
            <h2>信息流示例</h2>
            <FeedFlow />
        </div>
    )
}

ReactDOM.render(<APP/>, document.getElementById('app'))
