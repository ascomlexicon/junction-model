import React from 'react'
import useCanvas from './useCanvas'

const Canvas = props => {  
  
  const { draw, ...rest } = props
  const canvasRef = useCanvas(draw)
  
  return <canvas ref={canvasRef} {...rest} style={{ width: '100%', height: '100%' }}/>
}

export default Canvas