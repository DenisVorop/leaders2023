import { Dropdown } from 'flowbite-react'
import React, { ReactNode } from 'react'
interface IDropdownItemProps { children: ReactNode }
const DropdownItem: React.FC<IDropdownItemProps> = ({ children }) => <Dropdown.Item>{children}</Dropdown.Item>
export default DropdownItem
