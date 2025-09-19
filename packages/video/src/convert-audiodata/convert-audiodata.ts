import {resampleAudioData} from './resample-audiodata';

export type ConvertAudioDataOptions = {
	audioData: AudioData;
	newSampleRate: number;
	trimStartInSeconds: number;
	trimEndInSeconds: number;
	targetNumberOfChannels: number;
};

const FORMAT: AudioSampleFormat = 's16';

export type PcmS16AudioData = {
	data: Int16Array;
	sampleRate: number;
	numberOfChannels: number;
	numberOfFrames: number;
	timestamp: number;
};

export const convertAudioData = ({
	audioData,
	newSampleRate,
	trimStartInSeconds,
	trimEndInSeconds,
	targetNumberOfChannels,
}: ConvertAudioDataOptions): PcmS16AudioData => {
	const {
		numberOfChannels: srcNumberOfChannels,
		sampleRate: currentSampleRate,
		numberOfFrames,
	} = audioData;
	const ratio = currentSampleRate / newSampleRate;

	const frameOffset = Math.round(trimStartInSeconds * audioData.sampleRate);
	const frameCount =
		numberOfFrames -
		Math.round((trimEndInSeconds + trimStartInSeconds) * audioData.sampleRate);

	const newNumberOfFrames = Math.floor(frameCount / ratio);

	if (newNumberOfFrames === 0) {
		throw new Error(
			'Cannot resample - the given sample rate would result in less than 1 sample',
		);
	}

	if (newSampleRate < 3000 || newSampleRate > 768000) {
		throw new Error('newSampleRate must be between 3000 and 768000');
	}

	const srcChannels = new Int16Array(srcNumberOfChannels * frameCount);

	audioData.copyTo(srcChannels, {
		planeIndex: 0,
		format: FORMAT,
		frameOffset,
		frameCount,
	});

	const data = new Int16Array(newNumberOfFrames * targetNumberOfChannels);
	const chunkSize = frameCount / newNumberOfFrames;

	if (
		newNumberOfFrames === frameCount &&
		targetNumberOfChannels === srcNumberOfChannels
	) {
		return {
			data: srcChannels,
			numberOfChannels: targetNumberOfChannels,
			numberOfFrames: newNumberOfFrames,
			sampleRate: newSampleRate,
			timestamp: audioData.timestamp + trimStartInSeconds * 1_000_000,
		};
	}

	resampleAudioData({
		srcNumberOfChannels,
		source: srcChannels,
		destination: data,
		newNumberOfFrames,
		chunkSize,
	});

	const newAudioData = {
		data: srcChannels,
		format: FORMAT,
		numberOfChannels: targetNumberOfChannels,
		numberOfFrames: newNumberOfFrames,
		sampleRate: newSampleRate,
		timestamp: audioData.timestamp + trimStartInSeconds * 1_000_000,
	};

	return newAudioData;
};
