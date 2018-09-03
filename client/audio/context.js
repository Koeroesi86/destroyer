import { createContext } from 'react'

/** @var {AudioContext} audioContext */
const audioContext = new (window.AudioContext)()
/** @var {HTMLAudioElement} audioNode */
let audioNode
/** @var {MediaElementAudioSourceNode} audioSource */
let audioSource
let isPlaying = false
const listeners = []
const connectedItems = []
const audioMountListeners = []

const onAudioMounted = (listener) => {
  audioMountListeners.push(listener)
}

const notifyListeners = () => {
  listeners.forEach(listener => {
    listener(isPlaying)
  })
}

const connectNode = (node) => {
  audioNode = node

  if (audioNode) {
    node.addEventListener('pause', (e) => {
      isPlaying = false
      notifyListeners()
    })
    node.addEventListener('play', (e) => {
      isPlaying = true
      notifyListeners()
    })
    node.addEventListener('error', (e) => {
      isPlaying = false
      console.warn('error playing', node.src)
      notifyListeners()
    })

    audioSource = audioContext.createMediaElementSource(node)

    connectedItems.forEach(item => {
      audioSource.connect(item)
      connectDestination(item)
    })

    audioMountListeners.forEach(cb => { cb() })
  }
}

const connectToSource = (item) => {
  connectedItems.push(item)
  if (audioSource) {
    audioSource.connect(item)
  }
}

const disconnectFromSource = (item) => {
  if (connectedItems.includes(item)) {
    if (audioSource) {
      audioSource.disconnect(item)
    }
  }
}

const play = () => {
  if (audioNode) {
    const playPromise = audioNode.play()

    if (playPromise) {
      playPromise
        .then(() => {
          console.log('playing', audioNode.src)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}

const pause = () => {
  if (audioNode) {
    audioNode.pause()
  }
}

const addPlayStatusListener = (listener) => {
  if (typeof listener === 'function') listeners.push(listener)
}

const removePlayStatusListener = (listener) => {
  if (listeners.includes(listener)) {
    listeners.splice(listeners.indexOf(listener), 1)
  }
}

/** @returns {AnalyserNode|boolean} */
const createAnalyser = () => {
  if (audioSource) {
    const analyser = audioContext.createAnalyser()
    analyser.smoothingTimeConstant = 0.8
    analyser.fftSize = 2048

    audioSource.connect(analyser)
    connectDestination(analyser)

    return analyser
  }

  return false
}

const createBiquadFilter = () => audioContext.createBiquadFilter()
const createGain = () => audioContext.createGain()
const connectDestination = (node) => node.connect(audioContext.destination)

export const Audio = createContext({
  addPlayStatusListener,
  removePlayStatusListener,
  connectNode,
  connectToSource,
  connectDestination,
  createBiquadFilter,
  createGain,
  onAudioMounted,
  play,
  pause,
  createAnalyser
})
