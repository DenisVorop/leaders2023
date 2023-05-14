
import { Dropdown as DropdownLib } from 'flowbite-react'
import { ReactNode, memo } from 'react'
interface IDropdownProps { label: string, children: ReactNode }
const DropdownComp: React.FC<IDropdownProps> = ({ label, children }) =>
    <DropdownLib label={label}>{children}</DropdownLib>
export default memo(DropdownComp)
