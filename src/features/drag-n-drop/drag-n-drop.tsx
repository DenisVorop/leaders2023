import { useCallback, FC, useState, useEffect, memo, ChangeEvent, DragEvent } from 'react'

interface IDragNDropProps {
    setFiles: (formData: FormData) => void
    className?: string
}

const DragNDrop: FC<IDragNDropProps> = ({
    setFiles,
    className = '',
}) => {
    const [drag, setDrag] = useState(false);

    const dragStartHandler = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDrag(true);
    }, []);

    const dragLeaveHandler = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDrag(false);
    }, []);

    const setFileHandler = useCallback((files: FileList) => {
        const formData = new FormData();
        formData.append('file', files[0]);
        setDrag(false);
        setFiles(formData);
    }, [setFiles]);

    const onDropHandler = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        setFileHandler(files);
    }, [setFileHandler]);

    const getFileHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.currentTarget.files;
        if (files) {
            setFileHandler(files);
        }
    }, [setFileHandler]);

    const pasteFileHandler = useCallback((e: ClipboardEvent) => {
        const dt = new DataTransfer();
        const files = e.clipboardData?.items;

        if (files) {
            Array.from(files).forEach((_, index) => {
                const item = files[index];
                if (item.kind === 'file') {
                    return dt.items.add(item.getAsFile());
                }
            });

            if (dt.items.length > 0) {
                const files = dt.files;
                setFileHandler(files);
            }
        }
    }, [setFileHandler]);

    useEffect(() => {
        document?.body?.addEventListener('paste', pasteFileHandler);
        return () => {
            document?.body?.removeEventListener('paste', pasteFileHandler);
        };
    }, [pasteFileHandler]);

    return (
        <div
            className={`flex flex-col items-center gap-4 w-full h-full border-2 border-dashed border-gray-200 rounded-lg select-none px-12 py-4 ${className}`}
            onDragStart={dragStartHandler}
            onDragLeave={dragLeaveHandler}
            onDragOver={dragStartHandler}
            onDrop={onDropHandler}
        >
            <div className='flex flex-col gap-1 items-center'>
                <svg className='h-10 w-10 text-gray-500' fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                {drag
                    ? <div className="flex flex-col items-center">
                        <div className=' font-medium text-sm text-gray-500'>Отпустите файл</div>
                        <div className='text-xs text-gray-500'>или можете</div>
                    </div>
                    : <div className="flex flex-col items-center">
                        <div className=' font-medium text-sm text-gray-500' >Перетащите файл </div>
                        <div className=' text-xs text-gray-500'>или можете</div>
                    </div>
                }
            </div>
            <label className="button cursor-pointer">
                <input
                    className='hidden'
                    type="file"
                    onChange={getFileHandler}
                    // accept=".png, .jpg, .jpeg .webp"
                    multiple
                />
                Выбрать файл
            </label>
        </div>
    )
}

export default memo(DragNDrop)
