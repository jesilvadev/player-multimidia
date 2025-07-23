'use client'

import {
  IoPlayCircle,
  IoPauseCircle,
  IoPlayBack,
  IoPlayForward,
  IoVolumeHigh,
  IoVolumeMute,
} from 'react-icons/io5'
import { useRef, useState, useEffect } from 'react'

export default function Player() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onLoadedMetadata = () => setDuration(video.duration)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadedmetadata', onLoadedMetadata)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.volume = volume
    video.muted = muted || volume === 0
  }, [volume, muted])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    playing ? video.pause() : video.play()
    setPlaying(!playing)
  }

  const handleSeek = (val: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = val
    setCurrentTime(val)
  }

  const toggleMute = () => {
    setMuted(!muted)
    if (volume === 0) setVolume(0.5)
  }

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-black flex justify-center items-center px-4">
      <div className="bg-gray-950 w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-6 text-white relative">
        <div className="rounded-xl overflow-hidden aspect-video">
          <video
            ref={videoRef}
            src="/videos/video.mp4"
            className="w-full h-full object-cover"
            preload="metadata"
          />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold">Último Romance</h3>
          <p className="text-sm text-gray-400">Los Hermanos</p>
        </div>

        <div className="text-xs text-gray-400 flex justify-between">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="w-full accent-red-500"
        />

        <div className="flex flex-wrap justify-between items-center mt-4 gap-4 text-2xl">
          <IoPlayBack
            onClick={() => handleSeek(currentTime - 10)}
            className="hover:text-red-400 cursor-pointer"
          />

          {playing ? (
            <IoPauseCircle
              onClick={togglePlay}
              className="text-red-600 hover:text-red-500 cursor-pointer text-5xl"
            />
          ) : (
            <IoPlayCircle
              onClick={togglePlay}
              className="text-red-600 hover:text-red-500 cursor-pointer text-5xl"
            />
          )}

          <IoPlayForward
            onClick={() => handleSeek(currentTime + 10)}
            className="hover:text-red-400 cursor-pointer"
          />

          <div className="flex items-center gap-2 text-xl">
            <button onClick={toggleMute} className="focus:outline-none">
              {muted || volume === 0 ? (
                <IoVolumeMute className="hover:text-red-400" />
              ) : (
                <IoVolumeHigh className="hover:text-red-400" />
              )}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 h-1 accent-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
