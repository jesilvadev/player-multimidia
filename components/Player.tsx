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

const playlist = [
  {
    title: 'Último Romance',
    artist: 'Los Hermanos',
    src: '/videos/video.mp4',
  },
  {
    title: 'O Vento',
    artist: 'Los Hermanos',
    src: '/videos/video2.mp4',
  },
  {
    title: 'O Velho e o Moço',
    artist: 'Los Hermanos',
    src: '/videos/video3.mp4',
  },
]

export default function Player() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(playlist[0])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const setMeta = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', setMeta)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', setMeta)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.volume = volume
    video.muted = muted || volume === 0
  }, [volume, muted])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.load()
    video.play()
    setPlaying(true)
  }, [selectedVideo])

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
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1f1f1f] flex justify-center items-center p-6">
      <div className="w-full max-w-96 bg-[#121212] rounded-2xl shadow-2xl p-6 text-white space-y-6">

        {/* Playlist */}
        <div>
          <h2 className="text-sm text-gray-400 uppercase mb-2">Los Hermanos</h2>
          <ul className="space-y-1 text-sm">
            {playlist.map((track, idx) => (
              <li
                key={idx}
                className={`cursor-pointer px-4 py-2 rounded-lg transition ${
                  selectedVideo.src === track.src
                    ? 'bg-red-500 text-white font-bold'
                    : 'hover:bg-white/10 text-gray-300'
                }`}
                onClick={() => setSelectedVideo(track)}
              >
                {track.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Player visual */}
        <div className="aspect-video w-full overflow-hidden rounded-xl shadow-md">
          <video
            ref={videoRef}
            src={selectedVideo.src}
            className="w-full h-full object-cover"
            preload="metadata"
          />
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="text-xl font-semibold">{selectedVideo.title}</h3>
          <p className="text-sm text-gray-400">{selectedVideo.artist}</p>
        </div>

        {/* Tempo */}
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

        {/* Controles */}
        <div className="flex items-center justify-between mt-4 gap-4">
          <IoPlayBack
            onClick={() => handleSeek(currentTime - 10)}
            className="text-3xl hover:text-red-400 cursor-pointer"
          />

          {playing ? (
            <IoPauseCircle
              onClick={togglePlay}
              className="text-5xl text-red-600 hover:text-red-500 cursor-pointer"
            />
          ) : (
            <IoPlayCircle
              onClick={togglePlay}
              className="text-5xl text-red-600 hover:text-red-500 cursor-pointer"
            />
          )}

          <IoPlayForward
            onClick={() => handleSeek(currentTime + 10)}
            className="text-3xl hover:text-red-400 cursor-pointer"
          />

          <div className="flex items-center gap-2 w-36">
            <button onClick={toggleMute}>
              {muted || volume === 0 ? (
                <IoVolumeMute className="text-xl hover:text-red-400" />
              ) : (
                <IoVolumeHigh className="text-xl hover:text-red-400" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
