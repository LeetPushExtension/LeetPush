import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

export default function Spinner() {
  return (
    <div className="flex justify-center py-32">
      <Spin indicator={<LoadingOutlined className="text-lp-yellow"
                                        spin />}
            size="large" />
    </div>
  )
}
