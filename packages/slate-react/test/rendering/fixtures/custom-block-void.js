/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

export const schema = {
  nodes: {
    image: (props) => {
      return (
        React.createElement('img', { src: props.node.data.get('src'), ...props.attributes })
      )
    }
  }
}

export const state = (
  <state>
    <document>
      <image src="https://example.com/image.png" />
    </document>
  </state>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div data-slate-void="true">
    <span style="display:inline-block;vertical-align:top;width:0;height:0;color:transparent">
      <span></span>
    </span>
    <div contenteditable="false">
      <img src="https://example.com/image.png">
    </div>
  </div>
</div>
`.trim()