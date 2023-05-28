import Back from "@/components/back/back"
import Spinner from "@/components/spinner/spinner"
import Personal from "@/features/profile/personal"
import Documents from "@/features/profile/documents"
import { useSessionStorage } from "@/hooks/use-session-storage"
import MainLayout from "@/layouts/main"
import { useMeQuery } from "@/services/auth/api"
import { useNotify } from "@/services/notification/zustand"
import { useGetExperienceQuery, useGetProfileQuery } from "@/services/profile/api"
import { FC, ReactNode, useEffect, useState } from "react"
import Education from "@/features/profile/education"
import Experience from "@/features/profile/experience"
import { useRouter } from "next/router"
import { useErrorProcessing } from "@/hooks/use-error-processing"
import Popup from "@/features/popup/popup"
import { useGetNotificationKeyQuery } from "@/services/notification/api"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { openLinkInNewWindow } from "@/utils/utils"

enum ENavigationItems {
    LK = 'Личные данные',
    DOC = 'Документы',
    EDUC = 'Образование',
    WORK = 'Опыт работы',
}

const navigation = [
    {
        label: ENavigationItems.LK,
        svg: <svg className="h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    },
    {
        label: ENavigationItems.DOC,
        svg: <svg className="h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
    },
    {
        label: ENavigationItems.EDUC,
        svg: <svg className="h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.745 3A23.933 23.933 0 003 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 011.105.402l2.402 7.206a.75.75 0 001.104.401l1.445-.889m-8.25.75l.213.09a1.687 1.687 0 002.062-.617l4.45-6.676a1.688 1.688 0 012.062-.618l.213.09" />
        </svg>
    },
    {
        label: ENavigationItems.WORK,
        svg: <svg className="h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
    },
]

interface IProfileProps { }

enum EMenu {
    'ITEM' = 'menu-item'
}

const Profile: FC<IProfileProps> = () => {
    const { data: session, isLoading: isLoadingSession, isError: isErrorLoadingSession } = useMeQuery(null)
    const { data: userProfile, isLoading: isLoadingUserProfile } = useGetProfileQuery(null, { pollingInterval: 30 * 1000 })
    const { data: userExperience, isLoading: isLoadingUserExperience } = useGetExperienceQuery(null)
    const { data: notification } = useGetNotificationKeyQuery(null)
    console.log(notification)
    const [activeItem, setActiveItem] = useSessionStorage(EMenu.ITEM, ENavigationItems.LK)
    const router = useRouter()
    const [, copy, successCopied] = useCopyToClipboard()

    useErrorProcessing(successCopied, 'success', 'Код успешно скопирован')
    useErrorProcessing(isErrorLoadingSession, 'danger', 'Произошла ошибка при загрузке данных')
    useErrorProcessing(!userProfile && !isLoadingUserProfile, 'danger', 'Необходимо заполнить анкету', () => router.push('/personal-form'))

    useEffect(() => {
        return () => {
            sessionStorage.clear()
        }
    }, [])

    const [open, setOpen] = useState(false)

    if (isLoadingSession || isLoadingUserProfile || isLoadingUserExperience) return <Spinner />
    if (!userProfile) return <></>

    return (
        <>
            <div>
                <div className="custom-container">
                    <div className="card bg-white-opacity flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <Back />
                            <div className=" font-bold text-xl">Личная информация</div>
                        </div>
                        <div className="flex flex-col lg:grid lg:grid-cols-6 gap-6">
                            <div className="col-span-1 flex flex-row lg:flex-col gap-4 whitespace-nowrap flex-nowrap overflow-x-scroll">
                                {navigation.map(({ label, svg }, index) => {
                                    return <div
                                        key={index}
                                        className={`flex items-center gap-2 cursor-pointer hover:text-purple-600 ${activeItem === label && 'text-purple-600'}`}
                                        onClick={() => setActiveItem(label)}
                                    >
                                        {svg}
                                        <span>{label}</span>
                                    </div>
                                })}
                                {notification?.token &&
                                    <div
                                        className={`flex items-center gap-2 cursor-pointer hover:text-purple-600`}
                                        onClick={() => setOpen(true)}
                                    >
                                        <svg className="h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
                                        <span>Уведомления</span>
                                    </div>
                                }
                            </div>
                            <div className="card col-span-5">
                                {activeItem === ENavigationItems.LK &&
                                    <Personal profile={userProfile} session={session} />
                                }
                                {activeItem === ENavigationItems.DOC &&
                                    <Documents profile={userProfile} />
                                }
                                {activeItem === ENavigationItems.EDUC &&
                                    <Education profile={userProfile} />
                                }
                                {activeItem === ENavigationItems.WORK &&
                                    <Experience experience={userExperience} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Popup
                isVisible={open}
                onClose={() => setOpen(false)}
                className="flex flex-col gap-5"
            >
                <div className="flex flex-col gap-2">
                    <span className=" font-bold text-base">Подключение телеграм бота</span>
                    <span>Скопируйте токен и вставьте в телеграм-бота</span>
                </div>
                <span
                    onClick={() => copy(`/code ${notification?.token}`)}
                    className=" cursor-pointer max-w-[432px] h-[36px] rounded-lg bg-purple-100 flex items-center px-4"
                >
                    <p className="truncate max-sm:max-w-[280px] max-md:max-w-[320px]">{notification?.token}</p>
                </span>
                <button className="button" onClick={() => openLinkInNewWindow(notification?.link)}>Перейти в телеграм</button>
            </Popup>
        </>
    )
}

// @ts-ignore
Profile.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default Profile
