import { FC, memo } from 'react'

interface IProgressBarProps {
    percent: number
}

const ProgressBar: FC<IProgressBarProps> = ({ percent }) => {
    return (
        <div className="w-full bg-gray-200 rounded-full h-[6px] dark:bg-gray-700">
            <div className="bg-purple-600 h-[6px] rounded-full" style={{ width: `${percent}%` }}></div>
        </div>
    )
}

export default memo(ProgressBar)
