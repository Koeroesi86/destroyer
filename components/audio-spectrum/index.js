import React from 'react'
import { Audio } from '../../client/audio/context'
import AudioSpectrum from './AudioSpectrum'

const ContextualAudioSpectrum = props => (
  <Audio.Consumer>
    {({ createAnalyser, addPlayStatusListener }) =>
      <AudioSpectrum
        {...props}
        createAnalyser={createAnalyser}
        addPlayStatusListener={addPlayStatusListener}
      />
    }
  </Audio.Consumer>
)

export default window
  ? ContextualAudioSpectrum
  : AudioSpectrum
