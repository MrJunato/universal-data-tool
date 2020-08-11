// @flow weak

import React from "react"
import getTaskDescription from "../../utils/get-task-description.js"
import SampleContainer from "../SampleContainer"
import NLPAnnotator from "react-nlp-annotate/components/NLPAnnotator"
import useClobberedState from "../../utils/use-clobbered-state"

export default (props) => {
  const [currentSampleIndex, changeCurrentSampleIndex] = useClobberedState(
    props.sampleIndex,
    0
  )

  const sample = props.samples[currentSampleIndex]

  return (
    <SampleContainer
      {...props.containerProps}
      currentSampleIndex={currentSampleIndex}
      totalSamples={props.samples.length}
      taskOutput={props.samples.map((s) => s.annotation)}
      description={
        getTaskDescription(props.samples[currentSampleIndex]) ||
        props.interface.description
      }
      onChangeSample={(sampleIndex) => {
        if (props.containerProps.onExit) {
          props.containerProps.onExit(
            sampleIndex > currentSampleIndex ? "go-to-next" : "go-to-previous"
          )
        } else {
          changeCurrentSampleIndex(sampleIndex)
        }
      }}
    >
      <NLPAnnotator
        key={(props.sampleIndex || 0) + currentSampleIndex}
        type="transcribe"
        audio={sample.audioUrl}
        phraseBank={props.phraseBank}
        initialTranscriptionText={sample.annotation || ""}
        onFinish={(result) => {
          props.onSaveTaskOutputItem(currentSampleIndex, result)
          if (props.containerProps.onExit)
            props.containerProps.onExit("go-to-next")
        }}
      />
    </SampleContainer>
  )
}
