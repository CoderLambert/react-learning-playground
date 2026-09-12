import { useCallback, useEffect, useRef, useState } from "react";

const BOTTOM_THRESHOLD = 36;

function isNearBottom(element) {
  return element.scrollHeight - element.scrollTop - element.clientHeight <= BOTTOM_THRESHOLD;
}

export function useTranscriptAutoFollow({ messageCount, isStreaming }) {
  const transcriptRef = useRef(null);
  const [isFollowing, setIsFollowing] = useState(true);
  const [showBackToLatest, setShowBackToLatest] = useState(false);

  const scrollToLatest = useCallback((behavior = "smooth") => {
    const element = transcriptRef.current;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior });
    setIsFollowing(true);
    setShowBackToLatest(false);
  }, []);

  const handleScroll = useCallback(() => {
    const element = transcriptRef.current;
    if (!element) return;
    const atBottom = isNearBottom(element);
    setIsFollowing(atBottom);
    setShowBackToLatest(!atBottom);
  }, []);

  useEffect(() => {
    const element = transcriptRef.current;
    if (!element || !isFollowing) return;
    element.scrollTo({ top: element.scrollHeight, behavior: isStreaming ? "auto" : "smooth" });
    setShowBackToLatest(false);
  }, [messageCount, isStreaming, isFollowing]);

  return {
    transcriptRef,
    isFollowing,
    showBackToLatest,
    handleScroll,
    scrollToLatest,
  };
}
