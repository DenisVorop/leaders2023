import Header from '@/features/header/header'
import { FC, ReactNode } from 'react'

interface IMainLayoutProps {
    children: ReactNode
}

const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
    return (
        <div className='flex flex-col gap-6'>
            <Header />
            {children}
        </div>
    )
}

export default MainLayout
