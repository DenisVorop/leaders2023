import React from 'react'

interface ICategoriesProps {
    categories: string[]
}

const Categories: React.FC<ICategoriesProps> = ({ categories }) => {
    return categories.length
        ? <div className='flex gap-2'>
            {categories.map((category, index) => {
                return <div key={`${category}_${index}`} className='badge-purple'>{category}</div>
            })}
        </div>
        : null
}

export default React.memo(Categories)
