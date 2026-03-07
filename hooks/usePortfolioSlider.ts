"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function usePortfolioSlider(totalCards: number) {
  const [currentPage, setCurrentPage] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ currentPage: 0, totalCards });
  stateRef.current = { currentPage, totalCards };

  const isMobile = useCallback(() => {
    return typeof window !== "undefined" && window.innerWidth <= 768;
  }, []);

  const getCardsPerPage = useCallback(() => {
    return isMobile() ? 1 : 3;
  }, [isMobile]);

  const getTotalPages = useCallback(() => {
    return Math.ceil(totalCards / getCardsPerPage());
  }, [totalCards, getCardsPerPage]);

  const goToPage = useCallback(
    (page: number) => {
      const track = trackRef.current;
      if (!track) return;

      const perPage = getCardsPerPage();
      const targetIndex = page * perPage;
      const cards = track.querySelectorAll<HTMLElement>("[data-card]");
      const targetCard = cards[targetIndex];

      if (targetCard) {
        track.style.transform = `translateX(-${targetCard.offsetLeft}px)`;
      }

      setCurrentPage(page);
    },
    [getCardsPerPage]
  );

  // Keep a stable ref to goToPage for use in touch handlers
  const goToPageRef = useRef(goToPage);
  useEffect(() => {
    goToPageRef.current = goToPage;
  });

  const nextPage = useCallback(() => {
    const maxPage = getTotalPages() - 1;
    const next = currentPage >= maxPage ? 0 : currentPage + 1;
    goToPage(next);
  }, [currentPage, getTotalPages, goToPage]);

  // Touch / swipe support
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const container = track.parentElement;
    if (!container) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging = false;
    let dragOffset = 0;

    function getBaseOffset() {
      const cards = track!.querySelectorAll<HTMLElement>("[data-card]");
      const perPage = window.innerWidth <= 768 ? 1 : 3;
      const idx = stateRef.current.currentPage * perPage;
      const card = cards[idx];
      return card ? -card.offsetLeft : 0;
    }

    function onTouchStart(e: TouchEvent) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isDragging = false;
      dragOffset = 0;
      track!.style.transition = "none";
    }

    function onTouchMove(e: TouchEvent) {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;

      if (!isDragging && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
        isDragging = true;
      }

      if (isDragging) {
        e.preventDefault();
        dragOffset = dx;
        track!.style.transform = `translateX(${getBaseOffset() + dragOffset}px)`;
      }
    }

    function onTouchEnd() {
      // Restore CSS transition for the snap animation
      track!.style.transition = "";

      if (!isDragging) return;

      const perPage = window.innerWidth <= 768 ? 1 : 3;
      const maxPage =
        Math.ceil(stateRef.current.totalCards / perPage) - 1;
      const cur = stateRef.current.currentPage;
      const threshold = 50;

      let target = cur;
      if (dragOffset < -threshold && cur < maxPage) {
        target = cur + 1;
      } else if (dragOffset > threshold && cur > 0) {
        target = cur - 1;
      }

      goToPageRef.current(target);
      isDragging = false;
      dragOffset = 0;
    }

    // Mouse drag (desktop)
    function onMouseDown(e: MouseEvent) {
      touchStartX = e.clientX;
      touchStartY = e.clientY;
      isDragging = false;
      dragOffset = 0;
      track!.style.transition = "none";
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e: MouseEvent) {
      const dx = e.clientX - touchStartX;
      const dy = e.clientY - touchStartY;

      if (!isDragging && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
        isDragging = true;
      }

      if (isDragging) {
        e.preventDefault();
        dragOffset = dx;
        track!.style.transform = `translateX(${getBaseOffset() + dragOffset}px)`;
      }
    }

    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      track!.style.transition = "";

      if (!isDragging) return;

      const perPage = window.innerWidth <= 768 ? 1 : 3;
      const maxPage =
        Math.ceil(stateRef.current.totalCards / perPage) - 1;
      const cur = stateRef.current.currentPage;
      const threshold = 50;

      let target = cur;
      if (dragOffset < -threshold && cur < maxPage) {
        target = cur + 1;
      } else if (dragOffset > threshold && cur > 0) {
        target = cur - 1;
      }

      goToPageRef.current(target);
      isDragging = false;
      dragOffset = 0;
    }

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);
    container.addEventListener("mousedown", onMouseDown);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Resize handler
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => goToPage(0), 150);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [goToPage]);

  return {
    currentPage,
    totalPages: getTotalPages(),
    trackRef,
    nextPage,
  };
}
