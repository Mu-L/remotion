import type {EncodedPacket} from 'mediabunny';
import {
	ALL_FORMATS,
	AudioSampleSink,
	EncodedPacketSink,
	Input,
	MATROSKA,
	UrlSource,
	VideoSampleSink,
} from 'mediabunny';
import {makeKeyframeBank} from './keyframe-bank';
import {rememberActualMatroskaTimestamps} from './remember-actual-matroska-timestamps';

export const getSinks = async (src: string) => {
	const input = new Input({
		formats: ALL_FORMATS,
		source: new UrlSource(src),
	});

	const format = await input.getFormat();

	const videoTrack = await input.getPrimaryVideoTrack();
	if (!videoTrack) {
		throw new Error(`No video track found for ${src}`);
	}

	const audioTrack = await input.getPrimaryAudioTrack();
	const isMatroska = format === MATROSKA;

	return {
		video: {
			sampleSink: new VideoSampleSink(videoTrack),
			packetSink: new EncodedPacketSink(videoTrack),
		},
		audio: audioTrack
			? {
					sampleSink: new AudioSampleSink(audioTrack),
				}
			: null,
		actualMatroskaTimestamps: rememberActualMatroskaTimestamps(isMatroska),
		isMatroska,
	};
};

export type GetSink = Awaited<ReturnType<typeof getSinks>>;

export const getFramesSinceKeyframe = async ({
	packetSink,
	videoSampleSink,
	startPacket,
}: {
	packetSink: EncodedPacketSink;
	videoSampleSink: VideoSampleSink;
	startPacket: EncodedPacket;
}) => {
	const packet2 = await packetSink.getNextKeyPacket(startPacket, {
		verifyKeyPackets: false,
	});

	const samples = videoSampleSink.samples(
		startPacket.timestamp,
		packet2 ? packet2.timestamp : Infinity,
	);

	const keyframeBank = makeKeyframeBank({
		startTimestampInSeconds: startPacket.timestamp,
		endTimestampInSeconds: packet2 ? packet2.timestamp : Infinity,
		sampleIterator: samples,
	});

	return keyframeBank;
};
