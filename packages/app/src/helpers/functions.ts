import { Capacitor } from "@capacitor/core"

export const isSmartphone = Capacitor.getPlatform() === "ios" || Capacitor.getPlatform() === "android"
