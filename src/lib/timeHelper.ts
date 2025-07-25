export const getCurrentTimeString = () => {
  const now = new Date()
  const formatted = now.toISOString()
    .replace(/:/g, '-') // replace colons to make filename safe
    .replace(/\..+/, '') // remove milliseconds and timezone
  
  return formatted
}