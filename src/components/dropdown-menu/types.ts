export interface UIDropdownMenuItem {
  id: string
  label: string
  disabled?: boolean
  destructive?: boolean
}

export interface UIDropdownMenuProps {
  label: string
  items: readonly UIDropdownMenuItem[]
  disabled?: boolean
}
