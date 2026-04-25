import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Shared floating tooltip hook rendered via portal to avoid scroll clipping.
 */
export const useFloatingTooltip = ({ hideDelay = 120 } = {}) => {
  const [tooltipState, setTooltipState] = useState({
    visible: false,
    anchorRect: null,
    content: null,
    width: 384,
    estimatedHeight: 240,
    placement: 'auto'
  });

  const hideTimerRef = useRef(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const showTooltip = useCallback((targetEl, content, options = {}) => {
    if (!targetEl || typeof window === 'undefined') {
      return;
    }

    clearHideTimer();
    const rect = targetEl.getBoundingClientRect();

    setTooltipState({
      visible: true,
      anchorRect: {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
      },
      content,
      width: options.width || 384,
      estimatedHeight: options.estimatedHeight || 240,
      placement: options.placement || 'auto'
    });
  }, [clearHideTimer]);

  const hideTooltip = useCallback(() => {
    clearHideTimer();
    setTooltipState(prev => (
      prev.visible ? { ...prev, visible: false } : prev
    ));
  }, [clearHideTimer]);

  const scheduleHideTooltip = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setTooltipState(prev => (
        prev.visible ? { ...prev, visible: false } : prev
      ));
    }, hideDelay);
  }, [clearHideTimer, hideDelay]);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  const renderTooltip = useCallback(() => {
    if (
      typeof document === 'undefined' ||
      typeof window === 'undefined' ||
      !tooltipState.visible ||
      !tooltipState.anchorRect ||
      !tooltipState.content
    ) {
      return null;
    }

    const { anchorRect, width, estimatedHeight, placement, content } = tooltipState;
    const viewportHeight = window.innerHeight;
    const anchorTop = anchorRect.top;
    const anchorBottom = anchorTop + anchorRect.height;
    const anchorCenterX = anchorRect.left + anchorRect.width / 2;

    const shouldShowAbove =
      placement === 'top' ||
      (placement !== 'bottom' && anchorBottom + estimatedHeight > viewportHeight && anchorTop > estimatedHeight);

    const top = shouldShowAbove ? anchorTop - 12 : anchorBottom + 12;

    return createPortal(
      <div
        className="pointer-events-none fixed z-[9999]"
        style={{ top, left: anchorCenterX, transform: 'translate(-50%, 0)' }}
      >
        <div
          className="rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5"
          style={{ width }}
        >
          {content}
        </div>
      </div>,
      document.body
    );
  }, [tooltipState]);

  return {
    showTooltip,
    hideTooltip,
    scheduleHideTooltip,
    renderTooltip
  };
};
