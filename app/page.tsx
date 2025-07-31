"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Volume2, VolumeX, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const loveMessages = [
  "You are my sunshine on cloudy days ☀️",
  "Every moment with you feels like magic ✨",
  "You make my heart skip a beat 💓",
  "I fall in love with you more each day 🌹",
  "You are my forever and always 💕",
  "Your smile lights up my entire world 😊",
  "I'm so grateful to have you in my life 🙏",
  "You are my dream come true 💫",
  "Together we can conquer anything 👫",
  "You are the love of my life 💖",
]

const photos = [
  { src: "https://res.cloudinary.com/dpnw05tbx/image/upload/v1753941708/IMG-20250729-WA0063_tl9bwq.jpg", alt: "Our beautiful memory 1" },
  { src: "https://res.cloudinary.com/dpnw05tbx/image/upload/v1753941690/IMG-20250729-WA0066_yaocbj.jpg", alt: "Our beautiful memory 2" },
  { src: "https://res.cloudinary.com/dpnw05tbx/image/upload/v1753941692/IMG-20250729-WA0065_rxo9sj.jpg", alt: "Our beautiful memory 3" },
  { src: "https://res.cloudinary.com/dpnw05tbx/image/upload/v1753941698/IMG-20250729-WA0064_czlcvg.jpg", alt: "Our beautiful memory 4" },
]

const videos = [
  { src: "https://res.cloudinary.com/dpnw05tbx/video/upload/v1753942778/cap_kzbrlm.mp4", title: "Our First Pictures Together  💕" },
  { src: "https://res.cloudinary.com/dpnw05tbx/video/upload/v1754003406/joo_sjdqyq.mp4", title: "Just you 🌟" },
  { src: "https://res.cloudinary.com/dpnw05tbx/video/upload/v1754003416/lala_pwrarv.mp4", title: "Just Being Us 💖" },
  { src: "https://res.cloudinary.com/dpnw05tbx/video/upload/v1753941830/VID-20250729-WA0012_zuboud.mp4", title: "You are my everything 🥰" },
  { src: "https://res.cloudinary.com/dpnw05tbx/video/upload/v1753941772/VID-20250729-WA0010_mnkgdx.mp4", title: "Crazy 😂😂" },
  { src: "https://res.cloudinary.com/dpnw05tbx/video/upload/v1753941886/VID-20250729-WA0008_j7om4s.mp4", title: "Unforgettable Moments 🌈" },
]

const floatingMessages = [
  "I love you endlessly ❤️",
  "You make every day brighter ☀️",
  "Forever is just the beginning with you 💍",
  "You're the best part of my life 💖",
]

type AppPhase = "loading" | "champagne" | "floating-messages" | "main-content"

export default function GirlfriendSurprise() {
  const [phase, setPhase] = useState<AppPhase>("loading")
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [currentFloatingIndex, setCurrentFloatingIndex] = useState(0)

  const audioRef = useRef<HTMLAudioElement>(null)
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])

  // Cleanup function
  const cleanup = useCallback(() => {
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
    timeoutRefs.current = []
  }, [])

  // Safe timeout function
  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay)
    timeoutRefs.current.push(timeout)
    return timeout
  }, [])

  useEffect(() => {
    // Start the sequence
    safeSetTimeout(() => setPhase("champagne"), 1000)
    safeSetTimeout(() => setPhase("floating-messages"), 4000)
    safeSetTimeout(() => setPhase("main-content"), 12000) // 4s champagne + 8s messages

    return cleanup
  }, [safeSetTimeout, cleanup])

  // Handle floating messages progression
  useEffect(() => {
    if (phase === "floating-messages") {
      const interval = setInterval(() => {
        setCurrentFloatingIndex((prev) => {
          if (prev < floatingMessages.length - 1) {
            return prev + 1
          }
          clearInterval(interval)
          return prev
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [phase])

  // Handle scrolling messages in main content
  useEffect(() => {
    if (phase === "main-content") {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loveMessages.length)
      }, 3000)

      // Start music
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch(() => {
            console.log("Autoplay prevented")
          })
      }

      return () => clearInterval(interval)
    }
  }, [phase])

  const toggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }, [isPlaying])

  const playVideo = useCallback((index: number) => {
    setCurrentVideoIndex(index)
    setShowVideo(true)
    if (audioRef.current) {
      audioRef.current.volume = 0.3
    }
  }, [])

  const closeVideo = useCallback(() => {
    setShowVideo(false)
    if (audioRef.current) {
      audioRef.current.volume = 1
    }
  }, [])

  // Simplified floating hearts
  const FloatingHearts = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-400"
          style={{
            left: `${20 + i * 10}%`,
            bottom: "-50px",
          }}
          animate={{
            y: [-50, -window.innerHeight - 50],
            x: [0, (Math.random() - 0.5) * 100],
            rotate: [0, 360],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        >
          <Heart className="w-6 h-6 fill-current" />
        </motion.div>
      ))}
    </div>
  )

  // Simplified champagne effect
  const ChampagneEffect = () => (
    <motion.div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <motion.div
        className="w-8 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full"
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1, 1],
          y: [0, -200, -400],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* Simplified bubbles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-200 rounded-full"
          style={{
            left: `${45 + (i % 5) * 2}%`,
            top: "50%",
          }}
          initial={{ scale: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            y: [-20, -100 - i * 10],
            x: [(Math.random() - 0.5) * 50],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  )

  // Simplified balloon effect
  const BalloonEffect = () => (
    <motion.div className="fixed inset-0 pointer-events-none z-40">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 15}%`,
            bottom: "-100px",
          }}
          initial={{ y: 0, scale: 0 }}
          animate={{
            y: -window.innerHeight - 100,
            scale: 1,
          }}
          transition={{
            duration: 3,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        >
          <div
            className={`w-12 h-16 rounded-full ${
              i % 3 === 0 ? "bg-pink-400" : i % 3 === 1 ? "bg-red-400" : "bg-purple-400"
            } shadow-lg`}
          />
          <div className="w-0.5 h-8 bg-gray-400 mx-auto" />
        </motion.div>
      ))}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-red-100 overflow-hidden relative">
      {/* Background Music */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/Alex_Warren_-_Ordinary_CeeNaija.com_.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Control */}
      {phase === "main-content" && (
        <Button
          onClick={toggleMusic}
          className="fixed top-4 right-4 z-50 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3"
          size="icon"
        >
          {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      )}

      {/* Background Effects */}
      {phase === "main-content" && <FloatingHearts />}

      {/* Phase-based Content */}
      <AnimatePresence mode="wait">
        {/* Loading Phase */}
        {phase === "loading" && (
          <motion.div
            key="loading"
            className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-red-100"
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="text-4xl"
            >
              💕
            </motion.div>
          </motion.div>
        )}

        {/* Champagne Phase */}
        {phase === "champagne" && (
          <motion.div
            key="champagne"
            className="fixed inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-red-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ChampagneEffect />
            <BalloonEffect />
          </motion.div>
        )}

        {/* Floating Messages Phase */}
        {phase === "floating-messages" && (
          <motion.div
            key="floating-messages"
            className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-red-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence>
              {floatingMessages.slice(0, currentFloatingIndex + 1).map((message, index) => (
                <motion.div
                  key={index}
                  className="absolute text-2xl md:text-4xl font-bold text-pink-700 text-center px-4"
                  initial={{ y: 100, opacity: 0, scale: 0.5 }}
                  animate={{
                    y: -50 - index * 30,
                    opacity: index === currentFloatingIndex ? 1 : 0.3,
                    scale: index === currentFloatingIndex ? 1 : 0.8,
                  }}
                  exit={{ y: -200, opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {message}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Main Content Phase */}
        {phase === "main-content" && (
          <motion.div
            key="main-content"
            className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-red-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Happy Girlfriend Day! 💕
              </h1>
              <p className="text-xl md:text-2xl text-pink-700 font-semibold">You mean the world to me, beautiful! 🌸</p>
            </div>

            {/* Scrolling Love Messages */}
            <div className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-center bg-gradient-to-t from-pink-200 to-transparent">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMessageIndex}
                  className="text-lg md:text-xl font-semibold text-pink-800 text-center px-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {loveMessages[currentMessageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Photo Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl">
              {photos.map((photo, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg border-4 border-pink-300">
                    <Image
                      src={photo.src || "/placeholder.svg"}
                      alt={photo.alt}
                      width={400}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Heart className="w-6 h-6 text-red-500 fill-current" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Video Gallery */}
            <motion.div
              className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-pink-200 max-w-4xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-pink-700 mb-6 text-center">Special Moments 🎥</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {videos.map((video, index) => (
                  <div key={index} className="relative group cursor-pointer" onClick={() => playVideo(index)}>
                    <div className="relative overflow-hidden rounded-lg shadow-lg border-3 border-pink-300 bg-gradient-to-br from-pink-200 to-purple-200 h-32 flex items-center justify-center hover:scale-105 transition-transform">
                      <div className="text-pink-700 text-center">
                           <div className="text-4xl mb-2">▶️</div>
                    <p className="font-semibold text-sm">{video.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Final Love Message */}
            <motion.div
              className="mt-8 text-center max-w-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-4 border-pink-300">
                <h2 className="text-3xl font-bold text-pink-700 mb-4">I Love You More Than Words Can Say! 💕</h2>
                <p className="text-lg text-pink-600 leading-relaxed">
                  You are my everything, my heart, my soul, my forever. Thank you for being the most amazing girlfriend
                  in the world! Here's to many more beautiful moments together! 🌹✨
                </p>
                <div className="mt-6 text-4xl">💖👑💖</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideo}
          >
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col items-center justify-center p-4">
              <Button
                onClick={closeVideo}
                className="absolute top-4 right-4 z-10 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-2"
                size="icon"
              >
                ✕
              </Button>

              <h3 className="text-white text-2xl font-bold mb-4 text-center">{videos[currentVideoIndex]?.title}</h3>

              <video
                className="w-full h-auto max-h-[70vh] rounded-lg shadow-2xl"
                controls
                autoPlay
                onClick={(e) => e.stopPropagation()}
              >
                <source src={videos[currentVideoIndex]?.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={() => playVideo(Math.max(0, currentVideoIndex - 1))}
                  disabled={currentVideoIndex === 0}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  ← Previous
                </Button>
                <Button
                  onClick={() => playVideo(Math.min(videos.length - 1, currentVideoIndex + 1))}
                  disabled={currentVideoIndex === videos.length - 1}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Next →
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
