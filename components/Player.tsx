'use client'

import {
  IoPlayCircle,
  IoPauseCircle,
  IoPlayBack,
  IoPlayForward,
  IoVolumeMedium,
} from 'react-icons/io5'
import { useRef, useState, useEffect } from 'react'

export default function Player() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setDuration(video.duration)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (playing) {
      video.pause()
    } else {
      video.play()
    }
    setPlaying(!playing)
  }

  const handleSeek = (value: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value
    setCurrentTime(value)
  }

  return (
    <div className="max-w-xs mx-auto bg-[#1e293b] rounded-xl p-4 text-white space-y-4 shadow-lg">
      <div className="rounded overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/video.mp4"
          className="w-full rounded"
          preload="metadata"
        />
      </div>

      <div className="text-center">
        <h3 className="font-semibold text-lg">Último Romance</h3>
        <p className="text-sm text-gray-400">Los Hermanos</p>
      </div>

      <div className="px-2">
        <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-around text-white text-2xl px-2">
        <IoPlayBack
          className="hover:text-red-400 cursor-pointer"
          onClick={() => handleSeek(currentTime - 10)}
        />
        {playing ? (
          <IoPauseCircle
            className="text-red-600 hover:text-red-500 cursor-pointer text-5xl"
            onClick={togglePlayPause}
          />
        ) : (
          <IoPlayCircle
            className="text-red-600 hover:text-red-500 cursor-pointer text-5xl"
            onClick={togglePlayPause}
          />
        )}
        <IoPlayForward
          className="hover:text-red-400 cursor-pointer"
          onClick={() => handleSeek(currentTime + 10)}
        />
        <IoVolumeMedium className="hover:text-red-400 cursor-pointer" />
      </div>
    </div>
  )
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
