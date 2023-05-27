import React from 'react'
import { FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form'

interface ISearchInputProps {
    onClick: () => void
    register: UseFormRegister<FieldValues>
    name: string
    options?: RegisterOptions<FieldValues, string>
}

const SearchInput: React.FC<ISearchInputProps> = ({
    onClick,
    register,
    name,
    options,
}) => {
    return (
        <form className="flex items-center gap-2" onSubmit={e => e.preventDefault()}>
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <input
                {...register(name, options)}
                type="text"
                id="simple-search"
                className="input"
                placeholder="Поиск по новостям"
            />
            <button
                type="submit"
                className="button"
                onClick={onClick}
            >
                Найти
                <span className="sr-only">Search</span>
            </button>
        </form>
    )
}

export default React.memo(SearchInput)
