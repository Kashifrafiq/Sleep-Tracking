
import { loadTensorflowModel, useTensorflowModel } from "react-native-fast-tflite"

export const runModel = async (data) => {

    const model = loadTensorflowModel(require('../assets/soundclassifier_with_metadata.tflite'))
    // console.log('Data: ', data)
    // const output = model.model.runSync(data)

}