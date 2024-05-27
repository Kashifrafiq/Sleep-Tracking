import React, {startTransition, useState} from 'react';

import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {useTensorflowModel} from 'react-native-fast-tflite';
import {VoiceProcessor} from '@picovoice/react-native-voice-processor';
import {LineChart} from 'react-native-chart-kit';

let voiceProcessor = VoiceProcessor.instance;

const frameLength = 44032;
const sampleRate = 44100;

const App = () => {
  const [recording, setRecording] = useState(false);
  const [timeStamps, setTimeStamps] = useState([])
  const [snoreResult, setSnoreResult] = useState([])
  const [data, setData] = useState([1, 2, 3 , 4]);
  const model = useTensorflowModel(
    require('./src/assets/soundclassifier_with_metadata.tflite'),
  );

  const StartRecording = (setRecording, voiceProcessor) => {
    try {
      if (voiceProcessor.hasRecordAudioPermission()) {
        setRecording(true);
        voiceProcessor.start(frameLength, sampleRate);
        voiceProcessor.addFrameListener(frame => {
          const tensor = new Float32Array(frame);
          const output = model.model.runSync([tensor]);
          console.log('OutPut: ', output[0][1])
          const timeStamp = Date.now()
          setSnoreResult( prevValue => [...prevValue, output[0][1]])
          setTimeStamps( prevValue => [...prevValue, timeStamp]);
        });
      }
    } catch (e) {
      console.log('Error Recording the Audio: ', e);
    }
  };

  const StopRecording = (setRecording, voiceProcessor) => {
    if (voiceProcessor.isRecording()) {
      voiceProcessor.stop().then(r => {
        console.log('recording stoped: ', r);
        console.log('Snore Data: ', snoreResult);
        setData(snoreResult)
      });
    }
    setRecording(false);
  };

  const OnPressStart = () => {
    if (recording) {
      StopRecording(setRecording, voiceProcessor);
    }
    if (!recording) {
      StartRecording(setRecording, voiceProcessor);
    }
  };


  const chartLabels = timeStamps.map( timeStamp => {
    const seconds = (timeStamp - timeStamps[0]) / 1000;
    return seconds.toFixed(2);
  })

 
  return (
    <SafeAreaView
      style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
      <Button title={recording ? 'Stop' : 'Start'} onPress={OnPressStart} />
      <Text>{recording ? 'Recording...' : 'Not Recording'}</Text>
      <View>
        <LineChart
          data={{
            labels: chartLabels,
            datasets: [{
              data: data
            }],
          }}
          width={Dimensions.get('window').width}
          height={220}

          yAxisSuffix="%"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '0',
              strokeWidth: '',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
