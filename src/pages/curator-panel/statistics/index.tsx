import React, { FC, ReactNode } from 'react';
import Chart from '@/components/charts/bar/bar';
import MainLayout from '@/layouts/main';
import CuratorHeader from '@/features/header/curator-header';



const dataNumberOfResponses = [
    { name: 'Релевантные отклики', value: 120 },
    { name: 'Нерелевантные отклики', value: 230 },
];

const dataAgeOfCandidates = [
    { name: '19 лет', value: 136 },
    { name: '20 лет', value: 120 },
    { name: '21 год', value: 78 },
    { name: '22 года', value: 23 },
    { name: 'Другое', value: 56 },
];

const dataAcquisitionChannels = [
    { name: 'Соцсети', value: 136 },
    { name: 'Реклама на сайте', value: 89 },
    { name: 'По почте', value: 78 },
    { name: 'HH.ru', value: 120 },
    { name: 'Другое', value: 56 },
];

const dataExperience = [
    { name: 'менее 1 года', value: 235 },
    { name: '1 год', value: 120 },
    { name: '2 года', value: 78 },
    { name: '3 года', value: 70 },
    { name: 'Другое', value: 56 },
];

const dataEducation = [
    { name: 'Неоконченное высшее', value: 235 },
    { name: 'Оконченное высшее', value: 23 },
    { name: 'Среднее общее', value: 12 },
    { name: 'Среднее профессиональное', value: 23 },
    { name: 'Другое', value: 27 },
];

const dataUniversity = [
    { name: 'МГУ им. М.В. Ломоносова', value: 24 },
    { name: 'МГТУ им. Н.Э. Баумана', value: 78 },
    { name: 'НГУ', value: 20 },
    { name: 'МФТИ', value: 71 },
    { name: 'Другое', value: 27 },
];

const dataCity = [
    { name: 'Москва', value: 400 },
    { name: 'Санкт-Петербург', value: 23 },
    { name: 'Нижний Новгород', value: 12 },
    { name: 'Екатеринбург', value: 23 },
    { name: 'Другое', value: 27 },
];

const dataApplicationsForInterns = [
    { name: '1', value: 12 },
    { name: '2', value: 23 },
    { name: '3', value: 0 },
    { name: '4', value: 0 },
    { name: '5', value: 13 },
    { name: '6', value: 12 },
    { name: '7', value: 7 },
    { name: '8', value: 12 },
    { name: '9', value: 21 },
    { name: '10', value: 27 },
    { name: '11', value: 0 },
    { name: '12', value: 0 },
    { name: '13', value: 23 },
    { name: '14', value: 12 },
    { name: '15', value: 23 },
    // { name: '16', value: 27 },
    // { name: '17', value: 12 },
    // { name: '18', value: 12 },
    // { name: '19', value: 11 },
    // { name: '20', value: 12 },
    // { name: '21', value: 23 },
    // { name: '22', value: 9 },
    // { name: '23', value: 0 },
    // { name: '24', value: 2 },
    // { name: '25', value: 0 },
    // { name: '26', value: 0 },
    // { name: '27', value: 0 },
    // { name: '28', value: 12 },
    // { name: '29', value: 0 },
    // { name: '30', value: 0 },
];

const colors = ['#6875F5', '#E74694', '#9061F9', '#31C48D', '#FACA15'];


const Statistics: FC = () => {
    const sumOfResponses = dataNumberOfResponses.reduce((acc, cur) => acc + cur.value, 0);
    const sumOfApplications = dataApplicationsForInterns.reduce((acc, cur) => acc + cur.value, 0);

    const maxValue = (data) =>
        data.reduce((max, cur) => {
            return cur.value > max ? cur.value : max;
        }, 0);

    const popularAge = dataAgeOfCandidates.find((el) => el.value === maxValue(dataAgeOfCandidates))?.name;
    const popularChannel = dataAcquisitionChannels.find((el) => el.value === maxValue(dataAcquisitionChannels))?.name;
    const popularExperience = dataExperience.find((el) => el.value === maxValue(dataExperience))?.name;
    const popularEducation = dataEducation.find((el) => el.value === maxValue(dataEducation))?.name;
    const popularUniversity = dataUniversity.find((el) => el.value === maxValue(dataUniversity))?.name;
    const popularCity = dataCity.find((el) => el.value === maxValue(dataCity))?.name;

    const stats = useStatistics(["referer"])
    console.log(stats)

    return (
        <div>
            <div className='custom-container'>
                <div className='card flex flex-col gap-6'>
                    <div className="flex flex-col items-start gap-6">

                        <div className="font-bold text-20 leading-150 text-gray-900">Cтатистика (заявки кандидатов)</div>
                        <div className="grid grid-cols-12 gap-5 w-full">
                            <Chart
                                data={dataNumberOfResponses}
                                colors={colors}
                                textArray={['отклик', 'отклика', 'откликов']}
                                description={'всего откликов от потенциальных кандидатов'}
                                header={'Количество откликов'}
                                mainInfo={sumOfResponses}
                                size={'small'}
                                gridColumn={'span 3 / span 3'}
                            />
                            <Chart
                                data={dataAgeOfCandidates}
                                colors={colors}
                                textArray={null}
                                description={'самый частый возраст среди всех кандидатов'}
                                header={'Возраст кандидатов'}
                                mainInfo={popularAge}
                                size={'small'}
                                gridColumn={'span 3 / span 3'}
                            />
                            <Chart
                                data={dataAcquisitionChannels}
                                colors={colors}
                                description={'самый частый канал привлечения среди всех кандидатов'}
                                header={'Каналы привлечения'}
                                mainInfo={popularChannel}
                                textArray={null}
                                size={'small'}
                                gridColumn={'span 3 / span 3'}
                            />
                            <Chart
                                data={dataExperience}
                                colors={colors}
                                description={'самая частая продолжительность опыта работы среди кандидатов'}
                                header={'Опыт работы'}
                                textArray={null}
                                mainInfo={popularExperience}
                                size={'small'}
                                gridColumn={'span 3 / span 3'}
                            />
                            <Chart
                                data={dataEducation}
                                colors={colors}
                                textArray={null}
                                description={'самый часто встречающийся уровень образования среди кандидатов'}
                                header={'Образование'}
                                mainInfo={popularEducation}
                                size={'large'}
                                gridColumn={'span 4 / span 4'}
                            />
                            <Chart
                                data={dataUniversity}
                                colors={colors}
                                description={'самый часто встречающийся вуз среди кандидатов'}
                                header={'Вузы'}
                                textArray={null}
                                mainInfo={popularUniversity}
                                size={'large'}
                                gridColumn={'span 4 / span 4'}
                            />
                            <Chart
                                data={dataCity}
                                colors={colors}
                                textArray={null}
                                description={'самый часто встречающийся регион среди кандидатов'}
                                header={'Города'}
                                mainInfo={popularCity}
                                size={'large'}
                                gridColumn={'span 4 / span 4'}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-6 card">
                        <div className="font-bold text-20 leading-150 text-gray-900">Статистика (заявки на стажеров)</div>
                        <div className="grid grid-cols-12 gap-20 w-full">
                            <Chart
                                data={dataApplicationsForInterns}
                                colors={colors}
                                textArray={['заявка', 'заявки', 'заявок']}
                                description={'всего заявок на стажеров за месяц'}
                                header={'Количество заявок'}
                                mainInfo={sumOfApplications}
                                size={'small'}
                                gridColumn={'span 8 / span 8'}
                                type={'bar'}
                            />
                            <Chart
                                data={dataEducation}
                                colors={colors}
                                textArray={null}
                                description={'самый часто встречающийся уровень образования среди заявок на стажеров'}
                                header={'Образование'}
                                mainInfo={popularEducation}
                                size={'large'}
                                gridColumn={'span 4 / span 4'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}





// @ts-ignore
Statistics.getLayout = (page: ReactNode) => <MainLayout header={<CuratorHeader />}>{page}</MainLayout>

export default Statistics
