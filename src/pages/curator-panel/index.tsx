import { FC } from 'react'

const CuratorPanel: FC = () => <div>should be redirect</div>
export default CuratorPanel

export const getServerSideProps = () => {
    return {
        redirect: {
            statusCode: 301,
            destination: "/curator-panel/forms",
        }
    }
    return {
        props: {}
    }
}
