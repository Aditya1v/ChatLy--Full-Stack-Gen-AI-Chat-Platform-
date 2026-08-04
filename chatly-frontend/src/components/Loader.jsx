import { motion } from "framer-motion";

const MotionDot = motion.span;

const Loader = () => {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((dot) => (
        <MotionDot
          key={dot}
          className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 0.9,
            ease: "easeInOut",
            repeat: Infinity,
            delay: dot * 0.15,
          }}
        />
      ))}
    </div>
  );
};

export default Loader;
