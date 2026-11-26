function isOutsideDialog(event: MouseEvent) {
  const dialog = event.currentTarget as HTMLDialogElement
  if (event.target !== dialog) return false
  const { left, right, top, bottom } = dialog.getBoundingClientRect()
  return event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom
}

export function createDialogBackdrop() {
  let outsidePress = false

  function reset() {
    outsidePress = false
  }

  return {
    pointerDown(event: PointerEvent) {
      outsidePress = isOutsideDialog(event)
    },
    click(event: MouseEvent) {
      const clickedOutside = outsidePress && isOutsideDialog(event)
      reset()
      return clickedOutside
    },
    reset,
  }
}
