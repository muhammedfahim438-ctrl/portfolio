"use client";

import { useState, useCallback, useRef } from "react";

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const utteranceRef = useRef(null);

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;

    let words = text.split(/\s+/);
    let wordCount = 0;

    utterance.onstart = () => {
      setSpeaking(true);
      setCurrentText("");
      wordCount = 0;
    };

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        wordCount += 1;
        setCurrentText(words.slice(0, wordCount).join(" "));
      }
    };

    utterance.onend = () => {
      setSpeaking(false);
      setCurrentText(text);
    };

    utterance.onerror = () => {
      setSpeaking(false);
      setCurrentText("");
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setCurrentText("");
    utteranceRef.current = null;
  }, []);

  return { speak, stop, speaking, currentText };
}