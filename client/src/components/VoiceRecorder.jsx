import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';

const VoiceRecorder = ({ onRecordingComplete, language = 'english' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;

      // Setup audio context for visualization
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start visualization
      drawWaveform();

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(audioBlob);
        
        // Stop visualization
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      toast.success('Recording stopped');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }
  };

  const deleteRecording = () => {
    setAudioURL(null);
    setAudioBlob(null);
    setRecordingTime(0);
    audioChunksRef.current = [];
    toast.success('Recording deleted');
  };

  const confirmRecording = () => {
    if (audioBlob) {
      const file = new File([audioBlob], `recording-${Date.now()}.webm`, {
        type: 'audio/webm'
      });
      onRecordingComplete(file);
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const canvasCtx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = '#E7E7E2';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#F8D743';
      canvasCtx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Record Your Symptoms</Card.Title>
        <Card.Description>
          Describe your symptoms clearly in {language === 'english' ? 'English' : language === 'amharic' ? 'Amharic' : 'Afaan Oromoo'}
        </Card.Description>
      </Card.Header>
      
      <Card.Content>
        {/* Waveform Canvas */}
        <div className="mb-6">
          <canvas
            ref={canvasRef}
            width={600}
            height={120}
            className="w-full h-30 rounded-lg bg-cloud-gray"
          />
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-tena-black rounded-full">
            {isRecording && !isPaused && (
              <span className="w-3 h-3 bg-error rounded-full animate-pulse" />
            )}
            <span className="text-2xl font-mono font-bold text-tena-white">
              {formatTime(recordingTime)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          {!isRecording && !audioURL && (
            <Button
              variant="primary"
              size="lg"
              icon={Mic}
              onClick={startRecording}
              className="px-8"
            >
              Start Recording
            </Button>
          )}

          {isRecording && (
            <>
              <Button
                variant="outline"
                size="lg"
                icon={isPaused ? Play : Pause}
                onClick={pauseRecording}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                variant="primary"
                size="lg"
                icon={Square}
                onClick={stopRecording}
              >
                Stop
              </Button>
            </>
          )}

          {audioURL && (
            <>
              <Button
                variant="outline"
                size="lg"
                icon={Trash2}
                onClick={deleteRecording}
              >
                Delete
              </Button>
              <Button
                variant="primary"
                size="lg"
                icon={Check}
                onClick={confirmRecording}
              >
                Use Recording
              </Button>
            </>
          )}
        </div>

        {/* Playback */}
        {audioURL && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Tips:</strong> Speak clearly, describe symptoms, severity, and duration.
          </p>
        </div>
      </Card.Content>
    </Card>
  );
};

export default VoiceRecorder;
