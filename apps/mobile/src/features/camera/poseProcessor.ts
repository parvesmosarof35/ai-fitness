type Frame = any;

export interface MockPoseData {
  shoulders: string;
  hips: string;
  feedback: string;
}

export const mockProcessFrame = (frame: Frame): MockPoseData | null => {
  'worklet';
  // Note: we can't actually do heavy ML processing here without a real JSI module (like ML Kit)
  // For the UI simulation, we will just return static/dummy data.
  
  return {
    shoulders: 'aligned',
    hips: 'too high',
    feedback: 'Lower your hips',
  };
};
