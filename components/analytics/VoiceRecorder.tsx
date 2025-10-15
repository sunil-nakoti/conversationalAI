import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icon';

interface VoiceRecorderProps {
    onSaveClonedVoice: (voiceName: string) => Promise<void>;
}

type RecordingStatus = 'idle' | 'requesting' | 'recording' | 'recorded' | 'saving' | 'success' | 'error';

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSaveClonedVoice }) => {
    const [status, setStatus] = useState<RecordingStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    const startRecording = async () => {
        setStatus('requesting');
        setErrorMessage('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                stream.getTracks().forEach(track => track.stop()); // Release microphone
                const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);
                setStatus('recorded');
            };

            mediaRecorderRef.current.start();
            setStatus('recording');

        } catch (err) {
            console.error("Microphone access denied:", err);
            setErrorMessage("Microphone access was denied. Please enable it in your browser settings.");
            setStatus('error');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    };
    
    const handleSave = async () => {
        const voiceName = prompt("Please enter a name for this new voice:");
        if (voiceName && voiceName.trim() && audioBlob) {
            setStatus('saving');
            try {
                await onSaveClonedVoice(voiceName.trim());
                setStatus('success');
            } catch (error) {
                setErrorMessage("Failed to save the voice. Please try again.");
                setStatus('error');
            }
        }
    };

    const reset = () => {
        setStatus('idle');
        setErrorMessage('');
        setAudioBlob(null);
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(null);
    };
    
    if (status === 'success' || status === 'error') {
        return (
            <div className={`flex items-center justify-between w-full p-3 rounded-md ${status === 'success' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'}`}>
                <div className="flex items-center gap-2">
                   <Icon name={status === 'success' ? 'check' : 'warning'} className="h-5 w-5" />
                   <span>{status === 'success' ? 'New custom voice saved!' : errorMessage}</span>
                </div>
                <button onClick={reset} className="text-xs font-semibold hover:underline">Record another</button>
            </div>
        );
    }
    
    if (status === 'recorded' || status === 'saving') {
        return (
            <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-md space-y-3">
                <audio src={audioUrl!} controls className="w-full h-10" />
                <div className="flex gap-2">
                    <button onClick={reset} disabled={status === 'saving'} className="w-full text-sm font-semibold p-2 rounded-md bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 disabled:opacity-50">Discard</button>
                    <button onClick={handleSave} disabled={status === 'saving'} className="w-full text-sm font-semibold p-2 rounded-md bg-brand-accent text-white hover:bg-sky-500 disabled:opacity-50 flex items-center justify-center gap-2">
                        {status === 'saving' && <Icon name="spinner" className="h-4 w-4 animate-spin" />}
                        Save Voice
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button 
            onClick={status === 'recording' ? stopRecording : startRecording} 
            className={`flex items-center gap-2 w-full justify-center p-3 rounded-md transition-colors ${
                status === 'recording' 
                ? 'bg-red-500/80 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
        >
            <Icon name="microphone" className={`h-5 w-5 ${status === 'recording' ? 'animate-pulse' : ''}`} />
            {status === 'idle' && 'Record New Voice Sample'}
            {status === 'requesting' && 'Requesting permissions...'}
            {status === 'recording' && 'Stop Recording'}
        </button>
    );
};

export default VoiceRecorder;
