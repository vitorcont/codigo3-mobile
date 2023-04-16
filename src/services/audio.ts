import { Audio } from 'expo-av';
import { ReportProps } from './../models/module.d';

interface AudioServiceProps {
  report: ReportProps;
  setReport: (report: ReportProps) => void;
  recording: Audio.Recording | undefined;
  setRecording: (recording: Audio.Recording | undefined) => void;
}

interface OnStartRecordingProps {
  setRecording: (recording: Audio.Recording | undefined) => void;
}

interface OnRemoveAudioProps {
  report: ReportProps;
  setReport: (report: ReportProps) => void;
}

interface OnPlayAudioProps {
  report: ReportProps;
}

export async function onStartRecording({ setRecording }: OnStartRecordingProps) {
  try {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { recording } = await Audio.Recording.createAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    setRecording(recording);
  } catch (err) {
    console.error('Failed to start recording', err);
  }
}

export async function onStopRecording({
  report,
  setReport,
  recording,
  setRecording,
}: AudioServiceProps) {
  console.log('Stopping recording..');
  setRecording(undefined);
  await recording!.stopAndUnloadAsync();
  const uri = recording!.getURI();
  setReport({ ...report, audio: uri! });
}

export function onRemoveAudio({ report, setReport }: OnRemoveAudioProps) {
  setReport({ ...report, audio: '' });
}

export async function onPlayAudio({ report }: OnPlayAudioProps) {
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

  const { sound } = await Audio.Sound.createAsync({ uri: report.audio });

  await sound.playAsync();
}
