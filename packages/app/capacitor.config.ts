import { type CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "app.cojourney.app",
  appName: "Cojourney",
  webDir: "dist",
  server: {
    androidScheme: "https"
  }
}

export default config
