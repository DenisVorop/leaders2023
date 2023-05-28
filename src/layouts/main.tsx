import Header from '@/features/header/header'
import { FC, ReactNode } from 'react'

interface IMainLayoutProps {
    children: ReactNode
    header?: ReactNode
}

const MainLayout: FC<IMainLayoutProps> = ({ children, header = <Header /> }) => {
    return (
        <div className='flex flex-col gap-6'>
            {header}
            {children}
        </div>
    )
}

export default MainLayout
