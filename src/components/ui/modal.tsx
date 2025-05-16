"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  // Handle background click
  const handleBackdropClick = () => {
    onClose();
  };

  // Prevent clicks in modal content from closing the modal
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          "bg-background rounded-lg shadow-lg overflow-hidden max-w-md w-full mx-4",
          className
        )} 
        onClick={handleContentClick}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-4 border-b", className)}>
      {children}
    </div>
  );
}

export function ModalTitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-lg font-medium", className)}>
      {children}
    </h3>
  );
}

export function ModalDescription({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-muted-foreground mt-1", className)}>
      {children}
    </p>
  );
}

export function ModalBody({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-4 border-t flex justify-end gap-2", className)}>
      {children}
    </div>
  );
}