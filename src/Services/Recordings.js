import {
  loadTensorflowModel,
  useTensorflowModel,
} from 'react-native-fast-tflite';
import { runModel } from './TfFunction';



export const StartRecording = (setRecording, voiceProcessor) => {
  try {
    if (voiceProcessor.hasRecordAudioPermission()) {
      setRecording(true);
      voiceProcessor.start(frameLength, sampleRate);
      voiceProcessor.addFrameListener( frame => {
        runModel(frame)
        // console.log('Frame: ', frame)
      })
      
    }
  } catch (e) {
    console.log('Error Recording the Audio: ', e);
  }
};

export const StopRecording = (setRecording, voiceProcessor) => {
  if (voiceProcessor.isRecording()) {
    voiceProcessor.stop().then(r => {
      console.log('recording stoped: ', r);
    });
  }
  setRecording(false);
};
