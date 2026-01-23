import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScannerFrameProps {
  isScanning?: boolean;
  isSuccess?: boolean;
  className?: string;
}

export const ScannerFrame = ({ isScanning = false, isSuccess = false, className = "" }: ScannerFrameProps) => {
  const [showSuccessGlow, setShowSuccessGlow] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccessGlow(true);
      // Trigger haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]); // Light double tap pattern
      }
      const timer = setTimeout(() => setShowSuccessGlow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const cornerSize = "w-12 h-12 sm:w-16 sm:h-16";
  const cornerBaseClass = "absolute transition-all duration-500";
  const glowClass = showSuccessGlow 
    ? "shadow-[0_0_20px_rgba(16,185,129,0.8)]" 
    : isScanning 
      ? "shadow-[0_0_15px_rgba(139,92,246,0.6)]" 
      : "";

  // Gradient colors based on state
  const gradientFrom = showSuccessGlow ? "from-emerald-400" : "from-violet-500";
  const gradientVia = showSuccessGlow ? "via-green-500" : "via-purple-500";
  const gradientTo = showSuccessGlow ? "to-teal-400" : "to-indigo-500";

  return (
    <div className={`relative w-full max-w-sm aspect-[16/10] mx-4 ${className}`}>
      {/* Top Left Corner */}
      <motion.div
        animate={isScanning ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
        transition={{ duration: 1.5, repeat: isScanning ? Infinity : 0, ease: "easeInOut" }}
        className={`${cornerBaseClass} -top-1 -left-1 ${cornerSize} ${glowClass}`}
      >
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} rounded-tl-2xl`} />
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradientFrom} ${gradientVia} ${gradientTo} rounded-tl-2xl`} />
      </motion.div>

      {/* Top Right Corner */}
      <motion.div
        animate={isScanning ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
        transition={{ duration: 1.5, repeat: isScanning ? Infinity : 0, ease: "easeInOut", delay: 0.2 }}
        className={`${cornerBaseClass} -top-1 -right-1 ${cornerSize} ${glowClass}`}
      >
        <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-l ${gradientFrom} ${gradientVia} ${gradientTo} rounded-tr-2xl`} />
        <div className={`absolute top-0 right-0 w-1 h-full bg-gradient-to-b ${gradientTo} ${gradientVia} ${gradientFrom} rounded-tr-2xl`} />
      </motion.div>

      {/* Bottom Left Corner */}
      <motion.div
        animate={isScanning ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
        transition={{ duration: 1.5, repeat: isScanning ? Infinity : 0, ease: "easeInOut", delay: 0.4 }}
        className={`${cornerBaseClass} -bottom-1 -left-1 ${cornerSize} ${glowClass}`}
      >
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${gradientTo} ${gradientVia} ${gradientFrom} rounded-bl-2xl`} />
        <div className={`absolute bottom-0 left-0 w-1 h-full bg-gradient-to-t ${gradientTo} ${gradientVia} ${gradientFrom} rounded-bl-2xl`} />
      </motion.div>

      {/* Bottom Right Corner */}
      <motion.div
        animate={isScanning ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
        transition={{ duration: 1.5, repeat: isScanning ? Infinity : 0, ease: "easeInOut", delay: 0.6 }}
        className={`${cornerBaseClass} -bottom-1 -right-1 ${cornerSize} ${glowClass}`}
      >
        <div className={`absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l ${gradientTo} ${gradientVia} ${gradientFrom} rounded-br-2xl`} />
        <div className={`absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t ${gradientFrom} ${gradientVia} ${gradientTo} rounded-br-2xl`} />
      </motion.div>

      {/* Scanning line animation */}
      {isScanning && (
        <motion.div
          initial={{ top: "5%", opacity: 0 }}
          animate={{ 
            top: ["5%", "95%", "5%"],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.45, 0.55, 1]
          }}
          className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
          style={{
            boxShadow: "0 0 10px rgba(139, 92, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.4)"
          }}
        />
      )}

      {/* Success pulse effect */}
      {showSuccessGlow && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.95, 1.02, 1] }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 rounded-2xl border-2 border-emerald-400"
          style={{
            boxShadow: "0 0 30px rgba(16, 185, 129, 0.5), inset 0 0 30px rgba(16, 185, 129, 0.1)"
          }}
        />
      )}
    </div>
  );
};
