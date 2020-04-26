import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Player from 'xgplayer'
const log = (...args) => {
  if (process.env.NODE_ENV === 'development')
    console.log(...args)
  return args
}
window.Player = Player
function App() {
  let src = ''
  let xigua = useRef({})
  const divcopy = React.createRef()
  const inputref = React.createRef()
  let params = getParams(window.location.search.substr(1))
  let playerurl = params.find(e => e[0] === 'playurl')
  // 有url就不显示nav，默认没有url，显示
  let show_nav = true
  const [share, setShare] = useState('')
  if (typeof playerurl !== 'undefined') {
    playerurl[1] && (show_nav = false)
    src = playerurl[1]
  }
  const handleClick = function () {
    xigua.current.destroy(true)
    xigua.current = new Player({
      id: "xgplayer",
      url: getSrc(),
      autoplay: true,
      width: '100%',
      height: '100%',
      download: true
    })
  }
  useEffect(() => {
    xigua.current = new Player({
      id: "xgplayer",
      width: '100%',
      height: '100%',
      download: true
    })
    if (!show_nav) {
      xigua.current.start(src)
      // xigua.current.play()
    }
  }, [])

  const sharefullurl = () => {
    setShare(getShare())
  }
  const getShare = () => `${window.location.href}?playurl=${inputref.current.value}`
  const getSrc = () => inputref.current.value
  const copy = () => {
    var range = document.createRange();
    range.selectNode(divcopy.current); //changed here
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }
  const emedable = () => {
    let s = getShare()
    setShare(`
    <iframe id="player-share"
    title="webplayer-share"
    width="100%"
    height="400px"
    src="${inputref.current.value}"
    allow="fullscreen">
</iframe>
    `)
  }
  return (
    <div className="App">
      {
        show_nav && (
          <div className="nav-root">
            <div id="url-nav">
              <input  required ref={inputref} type="text" placeholder="play url" onChange={i => src = i.target.value}></input>
              <button className="play-btn" onClick={handleClick}>播放</button>
            </div>
            <div className=".share">
              <button onClick={sharefullurl}>单页全屏分享</button>
              <button onClick={emedable}>生成可嵌入iframe </button>
              <div ref={divcopy}>{share}</div>
              {share !== '' && (<button onClick={copy}>复制</button>)}
            </div>
          </div>
        )

      }
      <div id="player" style={!show_nav ? { height: '100%', width: '100%' } : {}}>
        <div id="xgplayer" style={{ paddingTop: 0, height: '100%' }}></div>
      </div>
    </div>
  );
}



/**
 * 
 * @param {String} s 
 */
function getParams(s) {
  let params = s.split('&')
  return params.map(p => p.split('='))
}

export default App;
