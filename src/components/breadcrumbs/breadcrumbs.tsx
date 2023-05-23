import Link from 'next/link'
import { FC, memo } from 'react'

const arrow = <svg aria-hidden="true" className=" mx-2 w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>

interface IBreadcrumbsProps {
    paths: { url?: string, title: string }[]
}

const Breadcrumbs: FC<IBreadcrumbsProps> = ({ paths }) => {
    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center">
                {paths.map(({ title, url }, index) => {
                    return index < paths.length - 1 && url
                        ? <div className="flex items-center">
                            <Crumb url={url} title={title} />
                            {index < paths.length - 1 && arrow}
                        </div>
                        : <div className="flex items-center">
                            <Crumb title={title} />
                            {index < paths.length - 1 && arrow}
                        </div>
                })}
            </ol>
        </nav>
    )
}

interface ICrumbProps {
    url?: string
    title: string
}
const Crumb: FC<ICrumbProps> = ({ url, title }) => {
    return (
        url
            ? <li className="inline-flex items-center">
                <Link href={url} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-purple-600 dark:text-gray-400 dark:hover:text-white">
                    {title}
                </Link>
            </li>
            : <li aria-current="page">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {title}
                </span>
            </li>
    )
}

export default memo(Breadcrumbs)
