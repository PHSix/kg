export const generateGraphName = () => {
  const date  = new Date()
  return `graph-${date.getTime()}`
}
