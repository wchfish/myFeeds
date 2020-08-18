import React from 'react'

const Message = (props) => {
  const { title, content } = props
  return (
    <div className="c-message-wrappper">
      <div className="title">{title || '默认标题'}</div>
      <div className="content">{content || '默认内容'}</div>
    </div>
  )
}

export default Message
