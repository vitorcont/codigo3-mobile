import * as ImagePicker from 'expo-image-picker';
import { ReportProps } from './../models/module.d';

interface CameraServiceProps {
  report: ReportProps;
  setReport: (report: ReportProps) => void;
  setVisible: (visible: boolean) => void;
}

interface RemovePhotoProps {
  report: ReportProps;
  setReport: (report: ReportProps) => void;
}

export async function onTakePhoto({ report, setReport, setVisible }: CameraServiceProps) {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();

  if (granted) {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });

    if (!result.cancelled) {
      let img = 'data:image/png;base64,' + result.base64!;
      setReport({ ...report, image: img });
    }
  }
  setVisible(false);
}

export async function onChooseFromGallery({ report, setReport, setVisible }: CameraServiceProps) {
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (granted) {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });

    if (!result.cancelled) {
      let img = 'data:image/png;base64,' + result.base64!;
      setReport({ ...report, image: img });
    }
  }

  setVisible!(false);
}

export function onRemovePhoto({ report, setReport }: RemovePhotoProps) {
  setReport({ ...report, image: '' });
}
