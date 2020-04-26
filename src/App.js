import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Player from 'xgplayer'
import logo from './logo.svg'
import github from './github.svg'
const log = (...args) => {
  if (process.env.NODE_ENV === 'development')
    console.log(...args)
  return args
}
const info = [
  '1. 受限于Web浏览器的显示，只支持mp4视频',
  '2. 生成的iframe可以嵌入到网页，全屏模式'
]

window.Player = Player
function App() {
  let [src, setSrc] = useState('')
  let [loading, setLoading] = useState(true)
  let xigua = useRef({})
  const divcopy = React.createRef()
  const inputref = React.createRef()
  let params = getParams(window.location.search.substr(1))
  let playerurl = params.find(e => e[0] === 'playurl')
  // 有url就不显示nav，默认没有url，显示
  const [show_nav, setShowNav] = useState(true)
  const [share, setShare] = useState('')
  useEffect(() => {
    if (typeof playerurl !== 'undefined') {
      playerurl[1] && (setShowNav(false))
      setSrc(playerurl[1])
    }
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [show_nav])

  const handleClick = function () {
    xigua.current.destroy(true)
    xigua.current = new Player({
      id: "xgplayer",
      url: getInputValue(),
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
  }, [src])

  const sharefullurl = () => {
    setShare(getShare())
  }
  const getShare = () => `${window.location.href}?playurl=${src}`
  const getInputValue = () => inputref.current.value
  const copy = () => {
    var range = document.createRange();
    range.selectNode(divcopy.current); //changed here
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }
  const emedable = () => {
    setShare(`
    <iframe id="player-share"
    title="webplayer-share"
    width="100%"
    height="400px"
    src="${getShare()}"
    allow="fullscreen">
</iframe>
    `)
  }
  const [disableAll, setDisable] = useState(true)

  return (
    <div className="App">
      <a href="https://github.com/iamwwc/webplayer" target="_blank" style={{
        backgroundColor:"#000"
      }}>
        <img src="/github.png"></img>
      </a>
      {
        show_nav && (
          <div className="nav-root">
            <div id="url-nav">
              <input required ref={inputref} type="text" placeholder="play url" onChange={i => {
                let v = i.target.value
                if (v === '') {
                  setDisable(true)
                } else {
                  setDisable(false)
                }
                setSrc(v)

              }}></input>
              <button disabled={disableAll} className="play-btn" onClick={handleClick}>播放</button>
            </div>
            <div className=".share">
              <button disabled={disableAll} onClick={sharefullurl}>单页全屏分享</button>
              <button disabled={disableAll} onClick={emedable}>生成可嵌入iframe </button>
              <div ref={divcopy}>{share}</div>
              {share !== '' && (<button onClick={copy}>复制</button>)}
            </div>
          </div>
        )

      }
      {
        loading && (
          <div className="loading">
            <img src={logo} className="spin-logo"></img>
          </div>
        )
      }
      <div id="player" style={!show_nav ? { height: '100%', width: '100%' } : {}}>
        <div id="xgplayer" style={{ paddingTop: 0, height: '100%' }}></div>
      </div>
      {show_nav && (
        <div className="info">
          <ul style={{
            listStyle: 'none'
          }}>
            {
              info.map((i, idx) => {
                return (
                  <li key={idx}>{i}</li>
                )
              })
            }
          </ul>
        </div>
      )}
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
