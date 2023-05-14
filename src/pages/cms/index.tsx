import React from 'react'

const CMS: React.FC = () => <div>should have redirected</div>

export async function getServerSideProps() {
    return {
        redirect: {
            permanent: true,
            destination: 'http://77.232.137.109:1338/admin/',
        },
    }
}

export default CMS
