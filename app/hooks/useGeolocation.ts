"use client"

import { useState, useEffect } from "react"

type PermissionState = "granted" | "denied" | "prompt"

export function useGeolocation() {
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    const checkPermission = async () => {
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" })
        setPermissionState(permission.state as PermissionState)

        permission.onchange = () => {
          setPermissionState(permission.state as PermissionState)
        }

        if (permission.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLatitude(position.coords.latitude)
              setLongitude(position.coords.longitude)
            },
            (error) => {
              setError(`Error: ${error.message}`)
            },
          )
        }
      } catch (error) {
        // Fallback if permissions API is not supported
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
            setPermissionState("granted")
          },
          (error) => {
            setError(`Error: ${error.message}`)
            setPermissionState("denied")
          },
        )
      }
    }

    checkPermission()
  }, [])

  return { latitude, longitude, error, permissionState }
}
