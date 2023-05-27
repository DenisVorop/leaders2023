import React, { useCallback, useState } from 'react'
import DragNDrop from '../drag-n-drop/drag-n-drop'
import { TProject } from '@/services/content/api'
import { useMeQuery } from '@/services/auth/api'
import { useErrorProcessing } from '@/hooks/use-error-processing'
import { useForm } from 'react-hook-form'
import { useSendResponseProjectMutation } from '@/services/content/actions-api'

interface IResponseProjectProps {
    project: TProject | null
    onClose: () => void
}

const ResponseProject: React.FC<IResponseProjectProps> = ({
    project,
    onClose,
}) => {
    const { data: session } = useMeQuery(null)
    const [sendResponse, { isSuccess, isError }] = useSendResponseProjectMutation()
    const { register, handleSubmit, reset } = useForm({ defaultValues: { text: '' } })

    const [formData, setFormData] = useState<FormData | null>(null)
    const [fileName, setFileName] = useState('')

    const handleClearFiles = useCallback(() => {
        setFormData(null)
        setFileName('')
        reset()
        onClose()
    }, [onClose, reset])

    const handleFileChange = (formData: FormData) => {
        const file = formData.get('file')
        if (file instanceof File) {
            const fileName = file.name
            setFileName(fileName)
        }
        setFormData(formData)
    };

    useErrorProcessing(isSuccess, 'success', 'Отклик успешно отправлен', handleClearFiles)
    useErrorProcessing(isError, 'danger')

    const handleSendResponse = handleSubmit((data) => {
        sendResponse({
            formData,
            text: data.text,
            projectId: project?.id,
            contact: session?.email,
            fileName,
        })
    })

    return (
        <>
            <div className='flex flex-col gap-2 max-w-[496px]'>
                <span className=' font-bold text-base'>Загрузите файлы</span>
                <span>Для отклика на стажировку необходимо загрузить решение тестового задания и резюме</span>
            </div>
            <DragNDrop
                setFiles={handleFileChange}
                className='w-[496px]'
            />
            {formData &&
                <div className='flex flex-col gap-3'>
                    <span className='font-bold text-base'>Загруженные файлы</span>
                    <div className='flex gap-2'>
                        <span className='text-sm text-purple-600 break-all'>{fileName}</span>
                        <svg
                            onClick={handleClearFiles}
                            className=' w-5 h-5 text-gray-400 cursor-pointer hover:text-red-600' fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </div>
                </div>
            }
            <div className='flex flex-col gap-3'>
                <span className='font-bold text-base'>Сопроводительное письмо <span className='text-red-500'>*</span></span>
                <textarea
                    {...register('text', { required: true })}
                    required
                    className='textarea'
                />
            </div>
            <button
                className='button w-full'
                disabled={!session?.email}
                onClick={handleSendResponse}
            >
                Отправить
            </button>
        </>
    )
}

export default React.memo(ResponseProject)
