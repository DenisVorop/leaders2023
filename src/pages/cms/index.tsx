import React from 'react'

const CMS: React.FC = () => <div>should have redirected</div>

export async function getServerSideProps() {
    return {
        redirect: {
            permanent: true,
            destination: 'https://cms.mycareer.fun/admin/',
        },
    }
}

export default CMS
