import { motion, AnimatePresence } from "motion/react";
import { Mail } from "lucide-react";
import { useState, useEffect, useRef, FormEvent } from "react";
// @ts-expect-error TS doesn't know about PNG imports without a module declaration
import logo from "./aint-white0logo.png";
import { supabase } from "./lib/supabase";

export default function App() {
  const [email, setEmail] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 2.5 second loading screen timeline before revealing "Enter"
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Target date: May 1, 2026
  const targetDate = new Date("2026-05-01T00:00:00").getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleEnter = () => {
    setHasEntered(true);
    // Explicit user interaction unlocks Safari's media restrictions
    if (videoRef.current) {
        videoRef.current.play().catch(e => console.warn(e));
    }
    if (audioRef.current) {
        audioRef.current.muted = false; // Unmute entirely!
        audioRef.current.play().catch(e => console.warn(e));
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from('waitlist')
      .insert([{ email: email }]);
    if (error) {
      if (error.code === '23505') alert("This email is already in the waitlist!");
      else alert("Oops! Something went wrong.");
    } else {
      alert(`Welcome to AINT! ${email} has been classified.`);
      setEmail("");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Mobile Container Simulation */}
      <div className="w-full max-w-md h-[844px] bg-black relative flex flex-col border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">

        {/* Loading / Entry Screen Overlay */}
        <AnimatePresence>
          {!hasEntered && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black"
            >
              {!isLoaded ? (
                <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                    className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  />
                </div>
              ) : (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  onClick={handleEnter}
                  className="px-8 py-3 tracking-[0.3em] text-sm font-light text-white uppercase border border-white/30 hover:border-white/80 rounded-full hover:bg-white/10 transition-all duration-500"
                >
                  Enter The World
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Background Cinematic Video */}
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/dkjifrprm/video/upload/q_auto,f_auto/v1775588708/Video_Generation_Based_on_Image_wd03hk.mp4"
          playsInline
          webkit-playsinline="true"
          muted
          onEnded={() => setVideoEnded(true)}
          className={`absolute z-0 inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${videoEnded ? 'opacity-40' : 'opacity-100'}`}
        />

        {/* Looping Audio */}
        <video
          ref={audioRef}
          src="https://res.cloudinary.com/dkjifrprm/video/upload/q_auto,f_auto/v1775588708/Video_Generation_Based_on_Image_wd03hk.mp4"
          loop
          playsInline
          className="hidden pointer-events-none w-0 h-0"
        />

        {videoEnded && (
          <>
            {/* Header */}
            <header className="relative z-10 pt-12 px-8 flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2"
              >
                <img src={logo} alt="AINT Logo" className="h-5 w-auto object-contain" />
              </motion.div>
            </header>

            {/* Visual Space (Pure Black) */}
            <div className="flex-1 flex items-center justify-center relative z-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="z-10 flex flex-col items-center"
              >
                {/* Countdown Timer */}
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Launching In:</span>
                <div className="flex gap-4 font-display">
                  {[
                    { label: "D", value: timeLeft.days },
                    { label: "H", value: timeLeft.hours },
                    { label: "M", value: timeLeft.minutes },
                    { label: "S", value: timeLeft.seconds },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-2xl font-bold tabular-nums">
                        {String(item.value).padStart(2, "0")}
                      </span>
                      <span className="text-[8px] text-white/30">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent mt-8" />
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="relative z-10 px-6 py-8 mx-4 mb-8 flex flex-col items-center text-center bg-white/5 backdrop-blur-sm shadow-2xl rounded-[2rem]">
              {/* Animated Glowing Border via CSS Masking */}
              <div
                className="absolute inset-0 z-0 rounded-[2rem] p-[1.5px] pointer-events-none"
                style={{
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude"
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%]"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.8) 100%)"
                  }}
                />
              </div>

              {/* Content wraps */}
              <div className="relative z-10 flex flex-col items-center w-full">
                {/* Tag */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-4 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] uppercase tracking-widest mb-6"
                >
                  Phase 001 // Classified
                </motion.div>

                {/* Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display font-bold text-3xl leading-tight mb-4 tracking-tight"
                >
                  NOTHING WILL <br />
                  BE THE SAME
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/60 text-sm leading-relaxed max-w-[280px] mb-8 font-light"
                >
                  "We're tearing down the establishment to build something unprecedented. Zero compromises. For those who refuse to follow. The drop is imminent."
                </motion.p>

                {/* Newsletter Form */}
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-3 mb-2"
                >
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black font-bold py-4 rounded-2xl text-sm hover:bg-white/90 transition-colors tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Classifying..." : "Notify Me"}
                  </button>
                </motion.form>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute z-10 bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
          </>
        )}
      </div>
    </div>
  );
}
