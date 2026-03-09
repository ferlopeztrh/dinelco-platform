export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    return !!ctx;
  } catch {
    return false;
  }
}
