
import { useGetAllProfiles } from '@/hooks/get-all-profiles'
import MainLayout from '@/layouts/main'
import { useRouter } from 'next/router'
import { FC, ReactNode } from 'react'

interface ICuratorPanelProps { }

const CuratorPanel: FC<ICuratorPanelProps> = () => {
    const [useProfiles] = useGetAllProfiles()
    const router = useRouter()

    return (
        <div>
            <div className='custom-container'>
                <div className='card'>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ФИО</th>
                                <th>Гражданство</th>
                                <th>Паспорт</th>
                                <th>Образование</th>
                                <th>Год рождения</th>
                                <th>Город</th>
                            </tr>
                        </thead>
                        <tbody>
                            {useProfiles.map(({ profile, experience }) => {
                                return <tr
                                    key={profile.id}
                                    className=' hover:bg-slate-100 hover:cursor-pointer'
                                    onClick={() => router.push(`/curator-panel/forms/${profile.id}`)}
                                >
                                    <td>{profile.id}</td>
                                    <td>{profile.surname} {profile.name} {profile.patronymic} ({profile.email})</td>
                                    <td>{profile.citizenship}</td>
                                    <td>{profile.passport_number} {profile.issuer} {profile.subdivision_code} {profile.date_of_issue}</td>
                                    <td>{profile.education} {profile.university} {profile.year_graduation}</td>
                                    <td>{new Date(profile.date_of_birth).toLocaleDateString()}</td>
                                    <td>{profile.city}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// @ts-ignore
CuratorPanel.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default CuratorPanel
