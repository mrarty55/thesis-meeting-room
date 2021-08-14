export default function minimumDate() {
  const date = new Date()
  date.setDate(new Date().getDate() + 4)
  return date.toISOString().substr(0, 10)
}
