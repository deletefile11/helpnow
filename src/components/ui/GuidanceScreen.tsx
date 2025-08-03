'use client';

import { GuideCard } from '@/components/GuideCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { type EmergencyScenario } from '@/utils/emergencyScenarios';
import { Heart, Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';

interface AudioControlsProps {
  instruction: string;
  audioState: 'idle' | 'playing' | 'paused';
  onPlay: () => void;
  onStop: () => void;
}

const AudioControls = ({ instruction, audioState, onPlay, onStop }: AudioControlsProps) => (
  <div className="flex items-center justify-center gap-2 mt-4 p-2 rounded-lg">
    <button
      onClick={onPlay}
      disabled={audioState === 'playing'}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
        audioState === 'playing'
          ? 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-200 cursor-not-allowed'
          : 'bg-gray-700 text-white hover:bg-gray-900'
      }`}
    >
      {audioState === 'playing' ? (
        <>🔊 Playing...</>
      ) : (
        <>
          <Play className="w-4 h-4" />
          Replay
        </>
      )}
    </button>
    
    {audioState === 'playing' && (
      <button onClick={onStop} className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white dark:text-gray-100 rounded-lg hover:bg-gray-700 transition-colors text-sm">
        <Pause className="w-4 h-4" />
        Stop
      </button>
    )}
  </div>
);

interface GuidanceScreenProps {
  scenario: EmergencyScenario;
  currentStep: number;
  audioEnabled: boolean;
  audioState: 'idle' | 'playing' | 'paused';
  onNextStep: () => void;
  onPreviousStep: () => void;
  onStartOver: () => void;
  onToggleAudio: () => void;
  onPlayAudio: (instruction: string) => void;
  onStopAudio: () => void;
}

export const GuidanceScreen = ({
  scenario,
  currentStep,
  audioEnabled,
  audioState,
  onNextStep,
  onPreviousStep,
  onStartOver,
  onToggleAudio,
  onPlayAudio,
  onStopAudio,
}: GuidanceScreenProps) => {
  const currentStepData = scenario.steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="text-center mb-6 pt-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{scenario.title}</h1>
        <div className="flex items-center justify-center gap-4">
          <button onClick={onStartOver} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 underline transition-colors">
            <RotateCcw className="w-4 h-4" />
            Start Over
          </button>
          <button
            onClick={onToggleAudio}
            className={`flex items-center gap-1 text-sm px-2 py-1 rounded transition-colors ${
              audioEnabled
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            Audio {audioEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <GuideCard
            step={currentStep + 1}
            totalSteps={scenario.steps.length}
            instruction={currentStepData.instruction}
            type={currentStepData.type}
            visualUrl={currentStepData.visualUrl}
            alternativeUrls={currentStepData.alternativeUrls}
            onNextStep={onNextStep}
            onPreviousStep={onPreviousStep}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === scenario.steps.length - 1}
          />
          {audioEnabled && (
            <AudioControls
              instruction={currentStepData.instruction}
              audioState={audioState}
              onPlay={() => onPlayAudio(currentStepData.instruction)}
              onStop={onStopAudio}
            />
          )}
        </div>
      </div>
      <div className="relative mt-6 flex justify-center">
        <p className="font-semibold text-white text-base sm:text-lg text-center bg-gradient-to-r from-red-900 via-red-500 to-red-900 px-4 py-2 rounded-full shadow-sm">
          Remember: Call 108 for serious emergencies!
        </p>
      </div>
    </div>
  );
};
